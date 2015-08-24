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

cache = {}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.text && (msg.text == "whereisit")) {
    if (!isGitHubUrl(window.location.origin)) {
      console.log('Not a GitHub page.');
      return;
    }

    var codeBlocks = document.getElementsByClassName('blob-wrapper');
    if (codeBlocks.length <= 0) {
      console.log('Page does not contain code');
      return;
    }

  var hasCode = codeBlocks.length > 0;
    var text = msg.selection || getSelectedText();
    var location = msg.location || (window.location.origin + window.location.pathname);
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
