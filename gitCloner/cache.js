var crypto = require('crypto');
var cache = {};

var hashFn = function(url, snippet) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  shasum.update(snippet);
  return shasum.digest('hex');
}

exports.store = function(url, snippet, response) {
  var cacheKey = hashFn(url, snippet);
  cache[cacheKey] = response;
  return response;
}

exports.get = function(url, snippet) {
  cacheKey = hashFn(url, snippet);
  inCache = cache[cacheKey];
  return inCache === undefined ? null : inCache;
}


