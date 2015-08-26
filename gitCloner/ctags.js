require ('shelljs/global');

var utils = require('./utils');
var emptyResult = [];

function failure() {
  return [];
}

function success(commandOutput) {
  return JSON.parse(commandOutput);
}

exports.run = function(tagname, repopath) {
  script = './scripts/runctags';

  // new lines cause the script to break
  // we'll just read until the first newline encountered
  tagname += '\n';
  tagname = tagname.replace(/\n.*/, '');

  cmd = [script, tagname, repopath].join(' ');
  return utils.run_cmd(cmd, failure, success)
}

exports.tag_file = function(filePath, repopath) {
  var script = './scripts/runctagsfile';
  var codePath = [repopath, filePath].join('/');
  var cmd = [script, codePath, repopath].join(' ');

  return utils.run_cmd(cmd, failure, success)
}
