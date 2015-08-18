PROD = "http://45.33.82.241:8880";
DEV = "http://localhost:8080";
SERVER_URL = PROD;

function hideInfo() {
  $("#title").hide();
  $("#selSom").hide();
  $("#spinner").hide();
}

function loading() {
  $("#spinner").show();
}

function failMessage() {
  $('#fail-msg').show();
}

function findstuff(data) {
  var userSelection = data.text;
  var location = data.location;
  var cachedResults = data.cached;
  var callback = data.callback;

  function success(resp) {
    hideInfo();
    callback(resp);
  }

  loading();

  if (cachedResults !== undefined) {
    console.log('using cached results:' + cachedResults);
    success(cachedResults);
    return;
  }

  sendRequest({
    snippet: userSelection,
    url: location,
  }, success, function() {});
}

/**
 * Given a user selection, make the API call to server
 * and populate the background html
 */
function findit(data) {
  var userSelection = data.text;
  var location = data.location;

  function cachedAddToDom(resp) {
    // background page is reloaded everytime it's clicked
    // so we sent a mesage to the current tab to use its cache
    getCurrentTab(function(tab) {
      chrome.tabs.sendMessage(
        tab.id, {
          text: "cachethis",
          cacheKey: userSelection,
          cacheValue: resp
        });
      addToDom(resp);
    })
  }

  function addToDom(resp) {
    $status = $('#status');
    $status.find('#search').text(userSelection);
    var status = document.getElementById('status');
    html = resp.forEach(function(v) {
      $status.append(makeResultHtml(v, location));
    });
    $("#title").show();
  }

  data.callback = cachedAddToDom;

  findstuff(data)
}

/* Make the ajax call to server */
function sendRequest(data, success, failure) {
  $.ajax({
    url: SERVER_URL,
    method: 'POST',
    data: JSON.stringify({'snippet': data.snippet, 'url': data.url}),
    contentType: 'application/json; charset=utf-8'
  }).done(function(resp) {
    console.log('JSON response from server: ' + resp);
    success(resp);
  }).fail(function(resp) {
    console.log('fail ' + resp);
    failure(resp);
  })
}

/**
 * Triggered when user clicks on the action button
 */
document.addEventListener('DOMContentLoaded', function() {
  var search = window.location.search.substring(1);
  if (search) {
    // a result of a right click from user
    contextMenuAction(search)
  } else {
    // user clicks on the action in the toolbar
    getCurrentTab(function(tab) {
      chrome.tabs.sendMessage(
        tab.id, { text: "whereisit" }, findit);
    })
  }
});

function contextMenuAction(search) {
  var splits = search.split('&', 2);
  var selection = splits[0].substring('selection'.length + 1);
  var location = splits[1].substring('location'.length + 1);
  findstuff({
    'text': selection,
    'location': location,
    'callback': redirectToFirstResult(location)
  });
}

function redirectToFirstResult(location) {
  return function(results) {
    var result = results[0];
    var url = makeLink(result.filepath, location, result.linenum);
    window.location.href = url;
  }
}

function getCurrentTab(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    callback(tabs[0]);
  });
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
