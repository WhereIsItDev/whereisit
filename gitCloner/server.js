var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

var getGit     = require("./getGit");
var ctags = require("./ctags");
var cache = require('./cache');

var jsonParser = bodyParser.json();

app.post('/', jsonParser, function(req,res){
    console.log("someone connected");
    url     = req.body.url;
    snippet = req.body.snippet;

    if (url == null || snippet == null) {
        return res.sendStatus(404);
    }

    console.log('request for ' + snippet + ' @ ' + url);

    cacheValue = cache.get(url, snippet)

    if (cacheValue) {
      console.log('served from web server cache');
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


var server   = app.listen(8880,function(){
});
