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

function Java() {
  var methodCallRegex = /\.?\w+\(/g;
  var methodReplaceRegex = /[.(]/g;

  function matchMethodCalls(str) {
    // method calls are usually a text node with x.method()
    // or when there is no parenthesis, it's a class constructor
    return str.match(methodCallRegex) || [str];
  }

  function stripMethodCall(str) {
    return str.replace(methodReplaceRegex, '')
  }

  function isMethod(node) {
    index = node.data.search(methodCallRegex);
    hasClass = node.parentElement.classList.contains('pl-smi');
    return hasClass || (index >= 0);
  }

  return {
    name: 'Java',
    matchMethodCalls: matchMethodCalls,
    stripMethodCall: stripMethodCall,
    isMethod: isMethod
  }
}
