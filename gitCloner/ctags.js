require ('shelljs/global');

// e.g. run('runDijkstra', 'repos/danielcodes/Algorithms/')
exports.run = function(tagname, repopath) {
  script = './scripts/runctags';

  // new lines cause the script to break
  // we'll just read until the first newline encountered
  tagname += '\n';
  tagname = tagname.replace(/\n.*/, '');

  cmd = [script, tagname, repopath].join(' ');
  console.log('running cmd: ' + cmd);
  var ret = exec(cmd, {silent:true});
  console.log('result: ' + ret.output);
  candidates = JSON.parse(ret.output);
  return candidates;
}
