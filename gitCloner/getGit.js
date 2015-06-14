require ('shelljs/global');

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
        var ret = exec('git clone --depth 1 ' + repoUrl + ' ' + repoPath);
        if (ret.code=="0") {
            echo('clone successful: ' + repoPath);
            return repoPath;
        }
    } else {
        oldDir = pwd();
        cd(repoPath);
        echo('repo already exists, updating');
        var ret = exec('git pull');
        if (ret.code=="0") {
            cd(oldDir);
            return repoPath;
        }
        cd(oldDir);
    }
    return null;
}


