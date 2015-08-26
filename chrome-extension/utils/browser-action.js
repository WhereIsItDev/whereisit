
function setLoadingState() {
  chrome.browserAction.setIcon({
    path: 'img/logo19-loading.png'
  })
}

function setNormalState() {
  chrome.browserAction.setIcon({
    path: 'img/logo19.png'
  })
}
