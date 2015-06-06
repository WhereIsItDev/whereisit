require ('shelljs/global');

exports.run = function(tagname, repopath) {
  script = './scripts/runctags'
  cmd = [script, tagname, repopath].join(' ');
  console.log(cmd);
  var ret = exec(cmd);
  console.log(ret);
}
