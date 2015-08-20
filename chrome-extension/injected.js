function getSelectedText() {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text.trim();
}

cache = {}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.text && (msg.text == "whereisit")) {
    var text = getSelectedText();
    var location = window.location.origin + window.location.pathname;
    if (text) {
      console.log('User selection is: ' + text);
      console.log(location);

      var inCache = cache[text];
      if (inCache !== undefined) {
        console.log('sending cached value for selection: ' + inCache);
        sendResponse({text:text, location: location, cached: inCache});
      } else {
        sendResponse({text:text, location: location});
      }
    } else {
        sendResponse({location: location});
    }
  }

  if (msg.text && (msg.text == "cachethis")) {
    console.log('received msg to cache: ' + msg.cacheKey);
    cache[msg.cacheKey] = msg.cacheValue;
  }

  if (msg.text && (msg.text == "addlinks")) {
    console.log('received msg to addLinks');
    msg_tags = {}
    msg.tags.forEach(function(v) {
      msg_tags[v.tagname] = v;
    })
    linkUpMethods(msg_tags);
  }
});


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

var traverseMethodCalls = function(startNode, callback) {
  function isMethod(node) {
    match = node.data.match(/\.?\w+\(/);
    hasClass = node.parentElement.classList.contains('pl-c1');
    return (match && match.length > 0) || hasClass;
  }
  traverseText(startNode, isMethod, callback);
}


/* Breaks the textNode into 3, before-regex, regex-matched, after-regex.
 * the regex-matched portion will be wrapped in a span of class 'wii'
 * returns the span that was created to wrap the matched word
 */
var breakTextAt = function(textNode, regex) {
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

function linkUpMethods(msg_tags) {
  var codeContainer = document.getElementsByClassName('blob-wrapper')[0]
  traverseMethodCalls(
    codeContainer,
    function(textNode) {
      matches = textNode.data.match(/\.?\w+\(/) || [];
      matches.forEach(function(match) {
        match = match.replace(/[.(]/g, '');
        tag = msg_tags[match];
        if (tag) { linkTag(tag, textNode); }
      })
    }
  )

  function linkTag(tag, textNode) {
    var url = makeLink(tag.filepath, window.location.href, tag.linenum);
    var span = breakTextAt(textNode, new RegExp("\\b" + tag.tagname + '\\b', "g"));
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
}
