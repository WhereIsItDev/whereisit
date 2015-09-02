
function setLoadingState(tabId) {
  chrome.pageAction.setIcon({
    tabId: tabId,
    path: 'img/logo19-loading.png',
  })
  chrome.pageAction.show(tabId)
}

function setNormalState(tabId) {
  chrome.pageAction.setIcon({
    tabId: tabId,
    path: 'img/logo19.png',
  })
  chrome.pageAction.show(tabId)
}
