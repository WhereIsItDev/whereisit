var express    = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app        = express();

var getGit     = require("./getGit");
var ctags = require("./ctags");
var cache = require('./cache');

var log = require('./logging');

app.post('/', jsonParser, function(req,res){
  log.debug('event=connected');
  url     = req.body.url;
  snippet = req.body.snippet;

  if (url == null || snippet == null) {
    return res.sendStatus(404);
  }

  log.debug('snippet=' + snippet + ' url=' + url);

  cacheValue = cache.get(url, snippet)

  if (cacheValue) {
    log.debug('event=web_server_cache');
    return res.json(cacheValue);
  }

  var repoPath = getGit.cloneFromGit(url);
  if (repoPath == null) {
    return res.sendStatus(404);
  }

  results = ctags.run(snippet, repoPath);

  cache.store(url, snippet, results);

  return res.json(results);
});


var server = app.listen(8880, function(){
});
