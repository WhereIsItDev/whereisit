function getSelectedText() {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text.trim();
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.text && (msg.text == "whereisit")) {
    var text = getSelectedText();
    if (text) {
      console.log('User selection is: ' + text);
      console.log(window.location.href);
      sendResponse({text:text, location:window.location.href});
    }else{
    }
  }
});
