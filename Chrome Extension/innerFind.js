PROD = "http://45.33.82.241:8880";
DEV = "http://localhost:8080";

var openInNewTab = function(url) {
  var backgroundPage = chrome.extension.getBackgroundPage();
  backgroundPage.open(url);
};


function findstuff(data) {
  var userSelection = data.text;
  var location = data.location;
  var cachedResults = data.cached;
  var callback = data.callback;
  var cachedResults = data.cached;

  if (cachedResults !== undefined) {
    console.log('using cached results:' + cachedResults);
    callback(cachedResults);
    return;
  }

  sendrequest({
    snippet: userSelection,
    url: location,
  }, callback);
}

/**
 * Given a user selection, make the API call to server
 * and populate the background html
 */
function findit(data) {
  var userSelection = data.text;
  var location = data.location;
  var cachedResults = data.cached;

  if (cachedResults !== undefined) {
    console.log('using cached results:' + cachedResults);
    addToDom(cachedResults);
    return;
  }

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
    resp.forEach(function(v) {
      var html = template.replace('$LINK', link(v.filepath, location, v.linenum))
      .replace('$PATH', v.filepath)
      .replace('$LINE', v.linenum)
      $status.append($(html));
      $status.find('pre').text(v.exerpt);
    });
    $status.find('.link').click(function(event) {
      var url = event.target.href;
      openInNewTab(url);
    })
    $("#spinner").hide();
    $("#selSom").hide();
    $("#title").show();
  }

  sendrequest({
    snippet: userSelection,
    url: location,
  }, cachedAddToDom);
}

function sendrequest(data, callback){
    $("#spinner").show();
    $("#title").hide();
    $("#selSom").hide();
    var form = new FormData();
    form.append("snippet", data.snippet);
    form.append("url", data.url);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", PROD, true);
    xhr.onreadystatechange = function(data,req) {
      if (xhr.readyState == 4) {
        var jsonResponse = JSON.parse(data.target.responseText);
        console.log('JSON response from server: ' + jsonResponse);
        callback(jsonResponse)
      }
    }
    xhr.send(form);
}

/**
 * Triggered when user clicks on the action button
 */
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('project-link').addEventListener('click', function(event) {
    openInNewTab(event.target.href);
  })
  var search = window.location.search.substring(1);
  console.log(search);
  if (search) {
    var splits = search.split('&', 2);
    var selection = splits[0].substring('selection'.length + 1);
    var location = splits[1].substring('location'.length + 1);
    findstuff({
      'text': selection,
      'location': location,
      'callback': function(r) {
        var result = r[0];
        var url = link(result.filepath, location, result.linenum);
        window.location.href = url;
      }
    });
  } else {
    getCurrentTab(function(tab) {
      chrome.tabs.sendMessage(
        tab.id, { text: "whereisit" }, findit);
    })
  }
});

function getCurrentTab(cb) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    cb(tab);
  });
}

var link = function(path, location, line) {
  var piecesOfUrl = location.split('/');
  var repo = piecesOfUrl[4];
  var user = piecesOfUrl[3];
  url = ['https://github.com', user, repo, 'blob', 'master', path].join('/');
  url += '#l' + line;
  return url;
}

var template = '<div class="result">' +
    '<div id="path">' +
      '<a class="link" href="$LINK">$PATH (line $LINE)</a>' +
    '</div>' +
    '<div id="snippet">' +
      '<pre>' +
      '</pre>' +
    '</div>' +
  '</div>';

/* dummy resp for testing */
var jsonresp = [{
  "exerpt": "public Graph(int number, double[][] adjMatrix)    {\n        //creates a graph with 'number' vertices\n        this.vertices = new Vertex[number];\n\n        //vertices must also be initialized\n",
  "kind": "method",
  "member_of": "class:Graph",
  "filepath": "Seven/Graph.java",
  "snippet": "public Graph(int number, double[][] adjMatrix)",
  "linenum": 10,
  "member_of_kind": "class",
  "member_of_name": "Graph"
}, {
  "exerpt": "public Graph(int number, double[][] adjMatrix)    {\n        //creates a graph with 'number' vertices\n        this.vertices = new Vertex[number];\n\n        //vertices must also be initialized\n",
  "kind": "method",
  "member_of": "class:Graph",
  "filepath": "Seven/Graph.java",
  "snippet": "public Graph(int number, double[][] adjMatrix)",
  "linenum": 10,
  "member_of_kind": "class",
  "member_of_name": "Graph"
}
];
