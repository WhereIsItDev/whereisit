var crypto = require('crypto');
var cache = {};

var hashFn = function(url, snippet) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  shasum.update(snippet);
  return shasum.digest('hex');
}

exports.storeUrlSnippet = function(url, snippet, results) {
  var cacheKey = hashFn(url, snippet);
  cache[cacheKey] = results;
  return results;
}

exports.getUrlSnippet = function(url, snippet) {
  var cacheKey = hashFn(url, snippet);
  inCache = cache[cacheKey];
  return inCache === undefined ? null : inCache;
}

exports.storeFileTags = function(filePath, repoPath, results) {
  var cacheKey = hashFn(filePath, repoPath);
  cache[cacheKey] = results;
  return results;
}

exports.getFileTags = function(filePath, repoPath, results) {
  var cacheKey = hashFn(filePath, repoPath);
  inCache = cache[cacheKey];
  return inCache === undefined ? null : inCache;
}
