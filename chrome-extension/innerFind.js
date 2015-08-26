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
    callback(resp);
  }

  loading();

  if (cachedResults !== undefined) {
    console.log('using cached results:' + cachedResults);
    success(cachedResults);
    return;
  }

  var url = SERVER_URL + (data.ff ? '/file' : '');
  console.log(url);

  sendRequest({
    url: url,
    snippet: userSelection,
    location: location,
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

  if (typeof(userSelection) === "undefined") {
    data.callback = function(resp) {
      $("#spinner").hide();
      setNormalState();
      getCurrentTab(function(tab) {
        chrome.tabs.sendMessage(
          tab.id, {
            text: "addlinks",
            tags: resp,
          });
      })
    }
    data.ff = true;
  } else {
    data.callback = function(resp) {
      hideInfo();
      setNormalState();
      cachedAddToDom(resp);
    }
    data.ff = false;
  }

  findstuff(data)
}

/* Make the ajax call to server */
function sendRequest(data, success, failure) {
  $.ajax({
    url: data.url,
    method: 'POST',
    data: JSON.stringify({'snippet': data.snippet, 'url': data.location}),
    contentType: 'application/json; charset=utf-8'
  }).done(function(resp) {
    console.log('JSON response from server: ' + resp);
    success(resp);
  }).fail(function(resp) {
    console.log('fail ' + resp);
    failure(resp);
  })
}

function redirectToFirstResult(location) {
  return function(results) {
    var result = results[0];
    var url = makeLink(result.filepath, location, result.linenum);
    window.location.href = url;
  }
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

chrome.runtime.onMessage.addListener(function(data) {
  console.log('data from onMessage');
  console.log(data);
  if (data.type === 'FINDIT' && data.location) {
    findit(data);
  }
});
