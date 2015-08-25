require ('shelljs/global');

var log = require('./logging');
var emptyResult = [];

function run_cmd(cmd, failResult) {
  var start = new Date();
  var ret = exec(cmd, {silent:true});

  if (ret.code !== 0) {
    var end = new Date();
    log.debug('event=run_command_fail message=' + ret.output);
    log.debug('command ' + cmd + ' took ' + ((end - start) / 1000) + 's')
    return failResult;
  }

  var end = new Date();
  log.debug('event=run_command_success result=' + ret.output);
  log.debug('command ' + cmd + ' took ' + ((end - start) / 1000) + 's')
  return JSON.parse(ret.output);
}

exports.run = function(tagname, repopath) {
  script = './scripts/runctags';

  // new lines cause the script to break
  // we'll just read until the first newline encountered
  tagname += '\n';
  tagname = tagname.replace(/\n.*/, '');

  cmd = [script, tagname, repopath].join(' ');
  return run_cmd(cmd, []);
}

exports.tag_file = function(filePath, repopath) {
  var script = './scripts/runctagsfile';
  var codePath = [repopath, filePath].join('/');
  var cmd = [script, codePath, repopath].join(' ');

  return run_cmd(cmd, []);
}
