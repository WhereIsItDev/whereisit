/**
 * Helper to send a message to the current tab
 */
function sendMessageToCurrentTab(message, callback) {
  getCurrentTab(function(tab) {
    if (!tab) return;
    chrome.tabs.sendMessage(tab.id, message, callback);
  })
}

/**
 * Helper to get the current tab and run callback
 */
function getCurrentTab(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    callback(tabs[0]);
  });
}

