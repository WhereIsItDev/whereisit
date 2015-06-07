require ('shelljs/global');

//Verifying for reqs...
if(!which('git')){
    echo ('you have NO git, dumb.');
}else{
    echo('You rock! (and have git)');
}
//END - Verifying for reqs...

//Globals
// file should be run using scripts/runserver from root dir
var reposDir  = 'repos';
var lastCheck = {};
//END - Globals

exports.cloneFromGit = function(url){
    var user        = '';
    var repoUrl     = '';
    var repo        = '';
    var piecesOfUrl = url.split('/');
    for (i=0; i < 5; i++){
        repoUrl += piecesOfUrl[i]+'/';
        if (i == 4)
            repo = piecesOfUrl[i];
        if (i == 3)
            user = piecesOfUrl[i];
    }


    repoPath = [reposDir, user, repo].join('/');
    console.log('repoPath=' + repoPath);

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
            echo("Yahoooooo!!!! You've cloned your stuff!!!");
            return repoPath;
        }
    } else {
        oldDir = pwd();
        cd(repoPath);
        echo("Pulling!");
        var ret = exec('git pull');
        if (ret.code=="0") {
            cd(oldDir);
            return repoPath;
        }
        cd(oldDir);
    }
    return null;
}


