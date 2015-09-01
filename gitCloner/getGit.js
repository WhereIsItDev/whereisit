var shell = require('shelljs');
var log = require('./logging');
var utils = require('./utils');

// file should be run using scripts/runserver from root dir
var reposDir  = 'repos';
var lastCheck = {};

function wasRecentlyPulled(repoUrl) {
  var timeNow = Date.now() / 1000 | 0;
  if (lastCheck.hasOwnProperty(repoUrl)) {
    if ((timeNow - lastCheck[repoUrl]) < 30) {
      log.debug('event=git_cached');
      return true;
    }
  }
  lastCheck[repoUrl] = timeNow;
  return false;
}

exports.cloneFromGit = function(url) {
    var splits = url.split('/');
    var user = splits[3];
    var repo = splits[4];
    var repoUrl = 'git:/' + splits.splice(1, 4).join('/');

    repoPath = [reposDir, user, repo].join('/');

    return repoPath;
    if (wasRecentlyPulled(repoUrl)) {
      return repoPath;
    }

    var dirExists = shell.test('-e', repoPath);
    var result;

    if (dirExists) {
        log.debug('event=git_directory_exists')
        oldDir = shell.pwd();
        shell.cd(repoPath);

        // in case of previously failed pull, reset it
        var cmd = 'git reset --hard';
        utils.run_cmd(cmd, function() { return; })

        var cmd = 'git pull -s recursive --rebase=preserve';
        result = utils.run_cmd(cmd, function() { return repoPath;})
        shell.cd(oldDir);
    } else {
        log.debug('event=git_need_to_clone')
        shell.mkdir('-p', repoPath);
        var cmd = 'git clone --depth 1 ' + repoUrl + ' ' + repoPath;
        result = utils.run_cmd(cmd, function() { return repoPath;})
    }
    return result;
}


