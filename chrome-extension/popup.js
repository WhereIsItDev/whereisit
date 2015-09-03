/**
 * Triggered when user clicks on the action button
 */
document.addEventListener('DOMContentLoaded', function() {
  // the background page can be loaded in 2 ways,
  // 1. when the user right clicks on a selection,
  // 2. when the user clicks on the toolbar button
  // the way we differentiate is that in case 1.
  // we set the search string to the url where the user right clicked.
  var search = window.location.search.substring(1);
  if (search) {
    // a result of a right click from user
    contextMenuAction(search)
  } else {
    // user clicks on the action in the toolbar
    toolbarButtonAction()
  }
});

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

  chrome.runtime.sendMessage({
    type: 'CONTEXT_MENU',
    text: selection,
    location: location
  }, function(results) {
    var result = results[0];
    var url = makeLink(result.filepath, location, result.linenum);
    window.location.href = url;
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
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    // send message to get user selection
    // expect to get back an object with the user selection
    // and the location of the page
    chrome.tabs.sendMessage(
      tab.id, {type: 'SELECTION_AND_LOCATION'}, triggerPageAction);
  });
}

function triggerPageAction(message) {
  var userSelection = message.text;
  var location = message.location;

  if (!userSelection || ! location) return;

  $("#spinner").show();
  chrome.runtime.sendMessage({
    type: 'PAGE_ACTION',
    text: userSelection,
    location: location
  }, function(results) {
    addToDom(results, location, userSelection);
  });
}

function addToDom(results, location, userSelection) {
  hideInfo();
  var $status = $('#status');
  $status.find('#search').text(userSelection);
  html = results.forEach(function(v) {
    $status.append(makeResultHtml(v, location));
  });
  $("#title").show();
}

function makeResultHtml(v, location) {
  var $template = $(resultTemplate);
  var link = makeLink(v.filepath, location, v.linenum);
  $template.find('.link')
    .attr('href', link)
    .text(v.filepath + '(line ' + v.linenum + ')');
  $template.find('.snippet pre')
    .text(v.exerpt);
  return $template;
}

var resultTemplate = '<div class="result">' +
    '<div class="path">' +
      '<a class="link" target="_blank"></a>' +
    '</div>' +
    '<div class="snippet">' +
      '<pre></pre>' +
    '</div>' +
  '</div>';

function hideInfo() {
  $("#title").hide();
  $("#selSom").hide();
  $("#spinner").hide();
}
