require ('shelljs/global');

// e.g. run('runDijkstra', 'repos/danielcodes/Algorithms/')
exports.run = function(tagname, repopath) {
  script = './scripts/runctags';
  cmd = [script, tagname, repopath].join(' ');
  console.log('running cmd: ' + cmd);
  var ret = exec(cmd, {silent:true});
  candidates = JSON.parse(ret.output);
  return candidates;
}
