var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var getGit     = require("./getGit");
var ctags = require("./ctags");
var cache = require('./cache');

var log = require('./logging');

function urlParam(req, res, next) {
  url = req.body.url;
  if (url === null) return res.sendStatus(404);
  else next();
}

function snippetParam(req, res, next) {
  url = req.body.url;
  snippet = req.body.snippet;
  if (snippet === null) return res.sendStatus(404);
  else next();
}

app.post('/file', urlParam, function(req,res){
  log.debug('event=connected');
  url = req.body.url;
  var repoPath = getGit.cloneFromGit(url);
  if (repoPath == null) {
    return res.sendStatus(404);
  }

  var p = url.split('/');
  // this will fail if we have a branch like "stable/1.8"
  filePath = p.slice(7).join('/');

  var results = cache.getFileTags(filePath, repoPath);
  if (results) {
    log.debug('event=web_server_cache');
  } else {
    results = ctags.tag_file(filePath, repoPath);
    cache.storeFileTags(filePath, repoPath, results);
  }

  log.debug('server responsed with ' + results.length + ' results.');
  return res.json(results);
});

app.post('/', urlParam, snippetParam, function(req,res){
  log.debug('event=connected');
  url     = req.body.url;
  snippet = req.body.snippet;
  log.debug('event=query snippet=' + snippet + ' url=' + url);

  var repoPath = getGit.cloneFromGit(url);
  if (repoPath == null) {
    return res.sendStatus(404);
  }

  var results;
  if (url && snippet) {
    results = cache.getUrlSnippet(url, snippet);
    if (results) {
      log.debug('event=web_server_cache');
    }
    results = ctags.run(snippet, repoPath);
    cache.storeUrlSnippet(url, snippet, results);
  } else {
    return res.json();
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
