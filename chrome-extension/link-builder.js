function linkUpMethods(msg_tags) {
  /* Breaks the textNode into 3, before-regex, regex-matched, after-regex.
   * the regex-matched portion will be wrapped in a span of class 'wii'
   * returns the span that was created to wrap the matched word
   */
  function breakTextAt(textNode, regex) {
    var span;
    textNode.data.replace(regex, function(matched) {
      var args = [].slice.call(arguments);
      var offset = args[args.length - 2];
      var newTextNode = textNode.splitText(offset);
      newTextNode.data = newTextNode.data.substr(matched.length);
      span = document.createElement('span');
      span.className = 'wii';
      span.textContent = matched;
      textNode.parentNode.insertBefore(span, newTextNode);
    })
    return span;
  }

  function linkTag(tag, textNode) {
    var url = makeLink(tag.filepath, window.location.href, tag.linenum);
    var span = breakTextAt(
      textNode, new RegExp("\\b" + tag.tagname + '\\b', "g"));
    var a = makeAhref(url, span.firstChild.data);
    span.replaceChild(a, span.firstChild);
  }

  function makeAhref(href, textContent) {
    var a = document.createElement('a');
    a.href = href;
    a.style.textDecoration = 'underline';
    a.textContent = textContent;
    return a;
  }

  var lang = guessFileExtension(window.location.pathname)();
  console.log('loaded ' + lang.name);

  function linkTextNodeToName(textNode, maybeName) {
    maybeName = lang.stripMethodCall(maybeName);
    tag = msg_tags[maybeName];
    if (tag) { linkTag(tag, textNode); }
  }

  function cleanNameAndLink(textNode) {
    matches = lang.matchMethodCalls(textNode.data);
    matches.forEach(function(match) { linkTextNodeToName(textNode, match); })
  }


  var codeContainer = document.getElementsByClassName('blob-wrapper')[0];

  traverseMethodCalls(
    codeContainer,
    lang.isMethod,
    cleanNameAndLink
  )
}
