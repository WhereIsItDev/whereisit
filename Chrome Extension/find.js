chrome.contextMenus.create({
  title: 'Where is it?',
  contexts: ['selection'],
  onclick: getClickHandler()
});

function getClickHandler() {
  return function(info ,tab) {
    var url = chrome.extension.getURL('find.html');
    url += '?selection=' + info.selectionText + '&location=' + info.pageUrl;
    chrome.tabs.create({url: url});
  }
};
