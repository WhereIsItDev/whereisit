require ('shelljs/global');

//Verifying for reqs...
if(!which('git')){
    echo ('you have NO git, dumb.');
}else{
    echo('You rock! (and have git)');
}
//END - Verifying for reqs...

//Globals
var reposDir = 'repos';
//END - Globals

exports.cloneFromGit = function(url,line,snippet){
    //var url     = 'https://github.com/paulopmx/Flexigrid/blob/master/js/flexigrid.js';
    //var line    = 13;
    //var snippet = 'function';

    var user        = '';
    var repoUrl     = '';
    var repo        = '';
    var piecesOfUrl = url.split('/');
    for(i=0;i<5;i++){
        repoUrl += piecesOfUrl[i]+'/';
        if(i==4)
            repo = piecesOfUrl[i];
        if(i==3)
            user = piecesOfUrl[i];
    }

    repoPath = [reposDir, user, repo].join('/');
    if(ls(repoPath).length==0){
        mkdir('-p', repoPath);
        var ret = exec('git clone ' + repoUrl + ' ' + repoPath);
        if(ret.code=="0"){
            echo("Yahoooooo!!!! You've cloned your stuff!!!");
            return repoPath;
        }
    }else{
        oldDir = pwd();
        cd(reposDir+'/'+user+'/'+repo);
        var ret = exec('git merge origin master');
        if(ret.code=="0"){
            cd(oldDir);
            return repoPath;
        }
        cd(oldDir);
    }
    return null;
}


