require ('shelljs/global');

var log = require('./logging');

exports.run = function(tagname, repopath) {
  script = './scripts/runctags';

  // new lines cause the script to break
  // we'll just read until the first newline encountered
  tagname += '\n';
  tagname = tagname.replace(/\n.*/, '');

  cmd = [script, tagname, repopath].join(' ');
  log.debug('event=run_command command=' + cmd);
  var ret = exec(cmd, {silent:true});
  log.debug('event=run_command_success result=' + ret.output);
  candidates = JSON.parse(ret.output);
  return candidates;
}

exports.tag_file = function(filePath, repopath) {
  var script = './scripts/runctagsfile';
  var codePath = [repopath, filePath].join('/');
  var cmd = [script, codePath, repopath].join(' ');

  log.debug('event=run_command command=' + cmd);

  var ret = exec(cmd, {silent:true});

  log.debug('event=run_command_success result=' + ret.output);

  candidates = JSON.parse(ret.output);
  return candidates;
}
