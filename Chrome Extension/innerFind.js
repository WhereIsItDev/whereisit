PROD = "http://45.33.82.241:8880";
DEV = "http://localhost:8080";

/**
 * Given a user selection, make the API call to server
 * and populate the background html
 */
function findit(text) {
  $status = $('#status');
  function addToDom(resp) {
    resp.forEach(function(v) {
      var html = template.replace('$LINK', link(v.filepath))
      .replace('$PATH', v.filepath)
      .replace('$LINE', v.linenum)
      .replace('$EXCERPT', v.exerpt);
      $status.append($(html));
    });
  }

  sendrequest({
    snippet: 'Graph',
    url: 'https://github.com/danielcodes/Algorithms/blob/master/Seven/Graph.java#L31',
    line: '13'
  }, addToDom);
}

function sendrequest(data, callback){
    var form = new FormData();
    form.append("snippet", data.snippet);
    form.append("url", data.url);
    form.append("line", data.line);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", PROD, true);
    xhr.onreadystatechange = function(data,req) {
      if (xhr.readyState == 4) {
        var jsonResponse = JSON.parse(data.target.responseText);
        callback(jsonResponse)
        console.log('JSON response from server: ' + jsonResponse);
      }
    }
    xhr.send(form);
}

/**
 * Triggered when user clicks on the action button
 */
document.addEventListener('DOMContentLoaded', function() {
  getCurrentTab(function(tab) {
    chrome.tabs.sendMessage(
      tab.id, { text: "whereisit" }, findit);
  })
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

var link = function(path) {
  return path;
}

var template = '<div class="result">' +
    '<div id="path">' +
      '<a class="link" href="$LINK">$PATH (line $LINE)</a>' +
    '</div>' +
    '<div id="snippet">' +
      '<pre>' +
      '$EXCERPT' +
      '</pre>' +
    '</div>' +
  '</div>';

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
