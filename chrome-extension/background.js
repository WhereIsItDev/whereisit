PROD = "http://45.33.82.241:8880";
DEV = "http://localhost:8080";
SERVER_URL = DEV;

function findstuff(data) {
  var userSelection = data.text;
  var location = data.location;
  var success = data.callback;

  var url = SERVER_URL + (data.ff ? '/file' : '');
  console.log(url);

  sendRequest({
    url: url,
    snippet: userSelection,
    location: location,
  }, success, function() {});
}

/* Make the ajax call to server */
function sendRequest(data, success, failure) {
  $.ajax({
    url: data.url,
    method: 'POST',
    data: JSON.stringify({'snippet': data.snippet, 'url': data.location}),
    contentType: 'application/json; charset=utf-8'
  }).done(function(resp) {
    success(resp);
  }).fail(function(resp) {
    failure(resp);
  })
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'FINDIT' && message.location) {
    // called from page load (injected script)
    var tabId = sender.tab.id;
    setLoadingState(tabId);
    message.tabId = tabId;
    pageFindIt(message, sendResponse);
    setNormalState(tabId);
  } else if (message.type === 'CONTEXT_MENU') {
    // called from user right click on context menu
    contextMenu(message, sendResponse);
  } else if (message.type === 'PAGE_ACTION') {
    // called from user click on page action
    pageAction(message, sendResponse);
  }

  // This function becomes invalid when the event listener returns,
  // unless you return true from the event listener to indicate you
  // wish to send a response asynchronously (this will keep the
  // message channel open to the other end until sendResponse is called).
  // https://developer.chrome.com/extensions/runtime#event-onMessage
  return true;
});

function pageAction(message, callback) {
  message.callback = callback;
  findstuff(message)
}

function contextMenu(message, callback) {
  message.callback = callback;
  findstuff(message)
}

function pageFindIt(message, callback) {
  message.ff = true;
  message.callback = callback;
  findstuff(message);
}
