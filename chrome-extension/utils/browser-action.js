
function setLoadingState() {
  chrome.browserAction.setIcon({
    path: 'img/logo19-loading.png'
  })
  chrome.browserAction.setBadgeText({text:"?"});
}

function setNormalState() {
  chrome.browserAction.setIcon({
    path: 'img/logo19.png'
  })
  chrome.browserAction.setBadgeText({text:""});
}
