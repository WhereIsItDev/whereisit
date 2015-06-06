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
var baseDir  = pwd();
//END - Globals

exports.cloneFromGit = function(url,line,snippet){
    //var url     = 'https://github.com/paulopmx/Flexigrid/blob/master/js/flexigrid.js';
    //var line    = 13;
    //var snippet = 'function';

    cd(baseDir);

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


    if(ls(reposDir+'/'+user+'/'+repo).length==0){
        mkdir('-p',reposDir+'/'+user+'/'+repo);
        cd(reposDir+'/'+user+'/');
        var ret = exec('git clone '+repoUrl);
        if(ret.code=="0"){
            echo("Yahoooooo!!!! You've cloned your stuff!!!");
            return 0;
        }
    }else{
        cd(reposDir+'/'+user+'/'+repo);
        var ret1 = exec('git fetch --all ');
        var ret2 = exec('git reset --hard origin/master');
        if(ret1.code=="0" && ret2.code=="0"){
            return 0;
        }
    }
    return -1;
}


