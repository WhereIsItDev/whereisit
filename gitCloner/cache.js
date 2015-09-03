var crypto = require('crypto');
var cache = {};
var timers = {};

var hashFn = function(url, snippet) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  shasum.update(snippet);
  return shasum.digest('hex');
}

exports.storeUrlSnippet = function(url, snippet, results) {
  var cacheKey = hashFn(url, snippet);
  cache[cacheKey] = results;
  timers[cacheKey] = new Date();
  return results;
}

exports.getUrlSnippet = function(url, snippet) {
  var cacheKey = hashFn(url, snippet);
  inCache = cache[cacheKey];
  return inCache === undefined ? null : isValid(cacheKey) ? inCache : null;
}

exports.storeFileTags = function(filePath, repoPath, results) {
  var cacheKey = hashFn(filePath, repoPath);
  cache[cacheKey] = results;
  timers[cacheKey] = new Date();
  return results;
}

exports.getFileTags = function(filePath, repoPath, results) {
  var cacheKey = hashFn(filePath, repoPath);
  inCache = cache[cacheKey];
  return inCache === undefined ? null : isValid(cacheKey) ? inCache : null;
}

FIVE_MINS_IN_MS = 5 * 60 * 1000;
function isValid(cacheKey) {
  var timeSet = timers[cacheKey];
  if (timeSet === undefined) return false;
  var now = new Date();
  var msPassed = now - timeSet;
  return msPassed < FIVE_MINS_IN_MS;
}
