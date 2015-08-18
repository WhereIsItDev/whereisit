function makeLink(path, location, line) {
  var splits = location.split('/');
  var github = 'https://github.com';
  var user = splits[3];
  var repo = splits[4];
  var blob = splits[5] || 'blob';
  var branch = splits[6] || 'master';
  url = [github, user, repo, blob, branch, path].join('/');
  url += '#l' + line;
  return url;
}
