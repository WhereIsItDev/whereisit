/*
 * Generic traversal function for the DOM
 * Starts at startNode and goes depth first
 * matches is a check before calling callback
 */
var traverseText = function(startNode, matches, callback) {
  matches = matches || function() { return true; };
  var nextSibling;
  for (var child = startNode.firstChild; child !== null; ) {
    // need this because mutating the dom causes this to enter infinite loop
    nextSibling = child.nextSibling;
    if (child.nodeType === 3) {
      if (matches(child)) {
        callback(child);
      }
    } else {
      traverseText(child, matches, callback);
    }
    child = nextSibling;
  }
  return startNode;
}

var traverseMethodCalls = function(startNode, isMethod, callback) {
  traverseText(startNode, isMethod, callback);
}

function Python() {
  var methodCallRegex = /\.?\w+\(/g;
  var methodReplaceRegex = /[.(]/g;

  function matchMethodCalls(str) {
    return str.match(methodCallRegex) || []; 
  }

  function stripMethodCall(str) {
    return str.replace(methodReplaceRegex, '')
  }

  function isMethod(node) {
    match = node.data.match(/\.?\w+\(/);
    hasClass = node.parentElement.classList.contains('pl-c1');
    return (match && match.length > 0) || hasClass;
  }

  return {
    name: 'Python',
    matchMethodCalls: matchMethodCalls,
    stripMethodCall: stripMethodCall,
    isMethod: isMethod
  }
}

function JavaScript() {
  var methodReplaceRegex = /[.(]/g;

  function matchMethodCalls(str) {
    return [str];
  }

  function stripMethodCall(str) {
    return str.replace(methodReplaceRegex, '')
  }

  function isMethod(node) {
    hasClass = node.parentElement.classList.contains('pl-c1');
    return hasClass;
  }

  return {
    name: 'JavaScript',
    matchMethodCalls: matchMethodCalls,
    stripMethodCall: stripMethodCall,
    isMethod: isMethod
  }
}

function Java() {
  var methodCallRegex = /\.?\w+\(/g;
  var methodReplaceRegex = /[.(]/g;

  function matchMethodCalls(str) {
    // method calls are usually a text node with x.method()
    // or when there is no parenthesis, it's a class constructor
    return str.match(methodCallRegex) || [str];
  }

  function stripMethodCall(str) {
    return str.replace(methodReplaceRegex, '')
  }

  function isMethod(node) {
    index = node.data.search(methodCallRegex);
    hasClass = node.parentElement.classList.contains('pl-smi');
    return hasClass || (index >= 0);
  }

  return {
    name: 'Java',
    matchMethodCalls: matchMethodCalls,
    stripMethodCall: stripMethodCall,
    isMethod: isMethod
  }
}

function guessFileExtension(filename) {
  // to add a new language,
  // add a new key-value map to mapping
  var splits = filename.split('.');
  var defaultLanguage = JavaScript;
  var mapping = {
    'py': Python,
    'js': JavaScript,
    'java': Java
  }

  if (splits.length > 0) {
    var ext = splits[splits.length - 1];
    if (mapping.hasOwnProperty(ext)) {
      return mapping[ext];
    }
  }
  return defaultLanguage;
}

function linkUpMethods(msg_tags) {
  /* Breaks the textNode into 3, before-regex, regex-matched, after-regex.
   * the regex-matched portion will be wrapped in a span of class 'wii'
   * returns the span that was created to wrap the matched word
   */
  function breakTextAt(textNode, regex) {
    var span;
    textNode.data.replace(regex, function(matched) {
      var args = [].slice.call(arguments);
      var offset = args[args.length - 2];
      var newTextNode = textNode.splitText(offset);
      newTextNode.data = newTextNode.data.substr(matched.length);
      span = document.createElement('span');
      span.className = 'wii';
      span.textContent = matched;
      textNode.parentNode.insertBefore(span, newTextNode);
    })
    return span;
  }

  function linkTag(tag, textNode) {
    var url = makeLink(tag.filepath, window.location.href, tag.linenum);
    var span = breakTextAt(
      textNode, new RegExp("\\b" + tag.tagname + '\\b', "g"));
    var a = makeAhref(url, span.firstChild.data);
    span.replaceChild(a, span.firstChild);
  }

  function makeAhref(href, textContent) {
    var a = document.createElement('a');
    a.href = href;
    a.style.textDecoration = 'underline';
    a.textContent = textContent;
    return a;
  }

  var lang = guessFileExtension(window.location.pathname)();
  console.log('loaded ' + lang.name);

  function linkTextNodeToName(textNode, maybeName) {
    maybeName = lang.stripMethodCall(maybeName);
    tag = msg_tags[maybeName];
    if (tag) { linkTag(tag, textNode); }
  }

  function cleanNameAndLink(textNode) {
    matches = lang.matchMethodCalls(textNode.data);
    matches.forEach(function(match) { linkTextNodeToName(textNode, match); })
  }


  var codeContainer = document.getElementsByClassName('blob-wrapper')[0];

  traverseMethodCalls(
    codeContainer,
    lang.isMethod,
    cleanNameAndLink
  )
}

function getSelectedText() {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text.trim();
}

function isGitHubUrl(url) {
  var ORIGIN_RE = /https?:\/\/github.com/;
  return url.search(ORIGIN_RE) !== -1;
}

function hasCodeBlock(document) {
  var codeBlocks = document.getElementsByClassName('blob-wrapper');
  return codeBlocks.length > 0;
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.type == 'SELECTION_AND_LOCATION') {
    if (!isGitHubUrl(window.location.origin)) return;
    if (!hasCodeBlock(document)) return;

    var text = getSelectedText();
    var location = msg.location || (window.location.origin + window.location.pathname);
    if (!text) return;

    sendResponse({text:text, location: location});
  }

  // important to return true to keep the async communications open
  return true;
});

window.onload = function() {
  // this script will be injected on all github pages (based on manifest)
  // do a check that this page contains code blocks
  if (!isGitHubUrl(window.location.origin)) return;
  if (!hasCodeBlock(document)) return;

  // Sends a message to the background script:
  // {
  //   'type': 'FINDIT',
  //   'location': current url
  // }
  var location = window.location.origin + window.location.pathname;
  chrome.runtime.sendMessage({
    type: 'FINDIT',
    location: location
  }, insertLinks);
}

function insertLinks(response) {
  if (!response) console.log(chrome.runtime.lastError);
  return;
  tags = {}
  response.forEach(function(v) { tags[v.tagname] = v; })
  linkUpMethods(tags);
}
