var url      = window.location.href; 
sendrequest("methodName", url)
//var query = file
function sendrequest(query, url){
	alert("Sending Request");
	$.post(localhost,url,query,acceptedQuery())
	// requests from the server with the query
}
// if returns, send data to return
function acceptedQuery(){

	alert("Acepted Query");
	// send data to post if successful, and retrieve the URLs
	$.get(localhost,getFromServer(data))

}

function getFromServer(data){

	var groupedData = data
	for (i = 0; i < data.length; i++) { 


	}

	//send the data to the frame

}
//on localhost
//server 8880