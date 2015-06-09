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
    if (text) {
      console.log('User selection is: ' + text);
      console.log(window.location.href);

      var inCache = cache[text];
      if (inCache !== undefined) {
        console.log('sending cached value for selection: ' + inCache);
        sendResponse({text:text, location:window.location.href, cached: inCache});
      } else {
        sendResponse({text:text, location:window.location.href});
      }
    }else{
    }
  }

  if (msg.text && (msg.text == "cachethis")) {
    console.log('received msg to cache: ' + msg.cacheKey);
    cache[msg.cacheKey] = msg.cacheValue;
  }
});
