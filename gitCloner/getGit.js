require ('shelljs/global');
var log = require('./logging');

// file should be run using scripts/runserver from root dir
var reposDir  = 'repos';
var lastCheck = {};

exports.cloneFromGit = function(url) {
    var user        = '';
    var repoUrl     = '';
    var repo        = '';
    var piecesOfUrl = url.split('/');

    piecesOfUrl[0] = "git:";
    for (i=0; i < 5; i++){
        repoUrl += piecesOfUrl[i]+'/';
        if (i == 4)
            repo = piecesOfUrl[i];
        if (i == 3)
            user = piecesOfUrl[i];
    }

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


    if (ls(repoPath).length==0) {
        mkdir('-p', repoPath);
        var cmd = 'git clone --depth 1 ' + repoUrl + ' ' + repoPath;
        var ret = exec(cmd, {silent: true});
        log.debug('command ' + cmd + ' took ');
        if (ret.code=="0") {
            echo('clone successful: ' + repoPath);
            return repoPath;
        }
    } else {
        oldDir = pwd();
        cd(repoPath);
        echo('repo already exists, updating');
        var cmd = 'git pull -s recursive --rebase=preserve';
        var ret = exec(cmd);
        log.debug('command ' + cmd + ' took ');
        cd(oldDir);

        if (ret.code=="0") {
          return repoPath;
        }
    }
    return null;
}


