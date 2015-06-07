var express    = require('express');
var bodyParser = require('body-parser');
var multer     = require('multer');
var app        = express();

var getGit     = require("./getGit");
var ctags = require("./ctags");

app.use(bodyParser.json());
app.use(multer());


app.post('/',function(req,res){
    url     = req.body.url;
    line    = req.body.line;
    snippet = req.body.snippet;

    if (url == null || line == null || snippet == null) {
        return res.send(" "+(-2));
    }

    var repoPath = getGit.cloneFromGit(url,line,snippet);
    if (repoPath == null) {
        return res.send(" "+(-2));
    }

    results = ctags.run(snippet, repoPath);

    return res.json(results);
});


var server   = app.listen(8880,function(){
});
