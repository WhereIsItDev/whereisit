/**
 * Triggered when user clicks on the action button
 */
// document.addEventListener('DOMContentLoaded', function() {
//   // the background page can be loaded in 2 ways,
//   // 1. when the user right clicks on a selection,
//   // 2. when the user clicks on the toolbar button
//   // the way we differentiate is that in case 1.
//   // we set the search string to the url where the user right clicked.
//   var search = window.location.search.substring(1);
//   setLoadingState();
//   if (search) {
//     // a result of a right click from user
//     contextMenuAction(search)
//     setNormalState();
//   } else {
//     // user clicks on the action in the toolbar
//     toolbarButtonAction()
//     // this is async, so we set normal state in callback
//   }
// });

/**
 * Called when the user right clicks a selection on the page
 * and clicks on the link to jump straight to the definition.
 * We store the user selection snippet and the url of the window
 * in the search parameters.
 */
function contextMenuAction(search) {
  var splits = search.split('&', 2);
  var selection = splits[0].substring('selection'.length + 1);
  var location = splits[1].substring('location'.length + 1);
  // might want to refactor this to use the same message sending mechanism
  // sendMessageToCurrentTab({
    // text: 'whereisit',
    // selection: selection,
    // location: location
  // }, findit);
  findstuff({
    'text': selection,
    'location': location,
    'callback': redirectToFirstResult(location)
  });
}

/**
 * Called when the user clicks on the toolbar button.
 * This sends a message to the current tab to
 * trigger a series of callbacks which basically
 * 1. gets the user selected text
 * 2. queries the server for the results
 * 3. updates the background page of the toolbar button
 */
function toolbarButtonAction() {
  sendMessageToCurrentTab({text: 'whereisit'}, findit);
}

/**
 * Returns if this current page is supported.
 * Use this method to check if the extension will function properly
 * when the user clicks on the action button.
 * Right no we only support GitHub pages, and only for pages
 * where there are code.
 */
function isSupportedPage(window) {
  var codeBlocks = document.getElementsByClassName('blob-wrapper');

  var hasCode = codeBlocks.length > 0;
  return isGitHubUrl(window.location.origin) && hasCode;
}

function isGitHubUrl(url) {
  var ORIGIN_RE = /https?:\/\/github.com/;
  return url.search(ORIGIN_RE) !== -1;
}
