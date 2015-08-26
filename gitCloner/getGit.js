require ('shelljs/global');
var log = require('./logging');
var utils = require('./utils');

// file should be run using scripts/runserver from root dir
var reposDir  = 'repos';
var lastCheck = {};

exports.cloneFromGit = function(url) {
    var piecesOfUrl = url.split('/');
    var user = piecesOfUrl[3];
    var repo = piecesOfUrl[4];
    var repoUrl = 'git:/' + piecesOfUrl.splice(1, 4).join('/');

    repoPath = [reposDir, user, repo].join('/');

    var timeNow = Date.now() / 1000 | 0;

    if(lastCheck.hasOwnProperty(repoUrl)){
        if((timeNow - lastCheck[repoUrl])<30){
            echo("I didn't pulled because I just did it!!!!");
            return repoPath;
        }else{
            lastCheck[repoUrl] = timeNow;
        }
    }else{
        lastCheck[repoUrl] = timeNow;
    }


    var dirExists = ls(repoPath).length === 0;
    var result;

    if (dirExists) {
        mkdir('-p', repoPath);
        var cmd = 'git clone --depth 1 ' + repoUrl + ' ' + repoPath;
        var ret = exec(cmd, {silent: true});
        result = utils.run_cmd(cmd, function() { return repoPath;})
    } else {
        oldDir = pwd();
        cd(repoPath);
        var cmd = 'git pull -s recursive --rebase=preserve';
        result = utils.run_cmd(cmd, function() { return repoPath;})
        cd(oldDir);
    }
    return result;
}


