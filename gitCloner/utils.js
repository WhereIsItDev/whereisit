var log = require('./logging');
var shell = require('shelljs');

function defaultFailure() {
  return null;
}

function run_cmd(cmd, success, failure) {
  failure = failure || defaultFailure;

  var start = new Date();
  var ret = shell.exec(cmd, {silent:true});

  if (ret.code !== 0) {
    var end = new Date();
    log.debug('event=run_command_fail message=' + ret.output);
    log.debug('command ' + cmd + ' took ' + ((end - start) / 1000) + 's')
    return failure();
  }

  var end = new Date();
  log.debug('event=run_command_success result=' + ret.output);
  log.debug('command ' + cmd + ' took ' + ((end - start) / 1000) + 's')
  return success(ret.output);
}

exports.run_cmd = run_cmd
