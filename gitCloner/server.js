var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var getGit     = require("./getGit");
var ctags = require("./ctags");
var cache = require('./cache');

var log = require('./logging');

app.post('/', function(req,res){
  log.debug('event=connected');
  url     = req.body.url;
  snippet = req.body.snippet;
  wholeFile = req.body.ff;

  if ((url == null || snippet == null) && (wholeFile === null)) {
    return res.sendStatus(404);
  }

  log.debug('event=query snippet=' + snippet + ' url=' + url);

  if (url && snippet) {
    cacheValue = cache.getUrlSnippet(url, snippet);
  } else {
    cacheValue = null;
  }

  if (cacheValue) {
    log.debug('event=web_server_cache');
    return res.json(cacheValue);
  }

  var repoPath = getGit.cloneFromGit(url);
  if (repoPath == null) {
    return res.sendStatus(404);
  }

  if (url && snippet) {
    results = ctags.run(snippet, repoPath);
  } else if (wholeFile === true) {
    var p = url.split('/');
    filePath = p.slice(7).join('/');
    results = ctags.tag_file(filePath, repoPath);
  } else {
    return res.json();
  }

  if (url && snippet) {
    cache.storeUrlSnippet(url, snippet, results);
  }

  return res.json(results);
});

app.post('/clone', function(req, res) {
  var url = req.body.url;

  if (url == null) {
    return res.sendStatus(404);
  }

  log.debug('event=clone url=' + url);

  var repoPath = getGit.cloneFromGit(url);

  if (repoPath == null) {
    return res.sendStatus(404);
  }

  return res.sendStatus(200);
})


var server = app.listen(8880, function(){
});
