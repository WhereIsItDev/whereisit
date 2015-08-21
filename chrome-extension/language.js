function Python() {
  var methodCallRegex = /\.?\w+\(/g;
  var methodReplaceRegex = /[.(]/g;

  function matchMethodCalls(str) {
    return str.match(methodCallRegex) || []; 
  }

  function stripMethodCall(str) {
    return str.replace(methodReplaceRegex, '')
  }

  function isMethod(node) {
    match = node.data.match(/\.?\w+\(/);
    hasClass = node.parentElement.classList.contains('pl-c1');
    return (match && match.length > 0) || hasClass;
  }

  return {
    name: 'Python',
    matchMethodCalls: matchMethodCalls,
    stripMethodCall: stripMethodCall,
    isMethod: isMethod
  }
}

function JavaScript() {
  var methodReplaceRegex = /[.(]/g;

  function matchMethodCalls(str) {
    return [str];
  }

  function stripMethodCall(str) {
    return str.replace(methodReplaceRegex, '')
  }

  function isMethod(node) {
    hasClass = node.parentElement.classList.contains('pl-c1');
    return hasClass;
  }

  return {
    name: 'JavaScript',
    matchMethodCalls: matchMethodCalls,
    stripMethodCall: stripMethodCall,
    isMethod: isMethod
  }
}
