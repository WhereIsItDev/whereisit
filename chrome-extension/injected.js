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
    console.log('received msg to addLinks: ' + msg.tags);
    msg.tags.forEach(function(v) {
      var codeParent = $('#LC' + v.linenum);
      var code = codeParent.children().filter(function(i, el) {
        return $(this).text() == v.tagname;
      });
      var url = makeLink(v.filepath, window.location.href, v.linenum);
      code.wrap('<a href="' + url + '" style="text-decoration: underline;"></a>');
    });
  }
});
