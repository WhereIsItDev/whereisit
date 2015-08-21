function guessFileExtension(filename) {
  var splits = filename.split('.');
  var defaultLanguage = JavaScript;
  var mapping = {
    'py': Python,
    'js': JavaScript
  }

  if (splits.length > 0) {
    var ext = splits[splits.length - 1];
    if (mapping.hasOwnProperty(ext)) {
      return mapping[ext];
    }
  }
  return defaultLanguage;
}
