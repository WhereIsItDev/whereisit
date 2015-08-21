/*
 * Generic traversal function for the DOM
 * Starts at startNode and goes depth first
 * matches is a check before calling callback
 */
var traverseText = function(startNode, matches, callback) {
  matches = matches || function() { return true; };
  var nextSibling;
  for (var child = startNode.firstChild; child !== null; ) {
    // need this because mutating the dom causes this to enter infinite loop
    nextSibling = child.nextSibling;
    if (child.nodeType === 3) {
      if (matches(child)) {
        callback(child);
      }
    } else {
      traverseText(child, matches, callback);
    }
    child = nextSibling;
  }
  return startNode;
}

var traverseMethodCalls = function(startNode, isMethod, callback) {
  traverseText(startNode, isMethod, callback);
}

