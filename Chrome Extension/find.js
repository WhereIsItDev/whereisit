chrome.tabs.executeScript( {
  code: "window.getSelection().toString();"
}, function(selection) {
  //document.getElementById("").value = selection[0];
  console.log(selection[0]);
});

document.addEventListener('dblclick', handleClick(),console.log);

function handleClick() {

	//if  new request
	createPopup(query,posX, posY, e.pageX, e.pageY);
	//else ignore OR close current one and create a new frame
}

function createPopup(query, x, y, windowX, windowY) {

	var frame = document.createElement('div');
	frame.
}

