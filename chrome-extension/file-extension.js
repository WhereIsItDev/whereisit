function guessFileExtension(filename) {
  // to add a new language,
  // add a new key-value map to mapping
  var splits = filename.split('.');
  var defaultLanguage = JavaScript;
  var mapping = {
    'py': Python,
    'js': JavaScript,
    'java': Java
  }

  if (splits.length > 0) {
    var ext = splits[splits.length - 1];
    if (mapping.hasOwnProperty(ext)) {
      return mapping[ext];
    }
  }
  return defaultLanguage;
}
