require ('shelljs/global');

var Logger = require('le_node');
var log = new Logger({
  token:'5df84de4-2596-48ad-923d-42a21d0343fb',
  console: true
});

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
