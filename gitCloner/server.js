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
    if(url != null && line != null && snippet != null ){
        console.log(getGit);
        res.send(" "+getGit.cloneFromGit(url,line,snippet));
    }else{
        res.send(" "+(-2));
    }
});


var server   = app.listen(8880,function(){
});
