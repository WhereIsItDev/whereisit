chrome.runtime.onMessage.addListener(function(messsage,sender,res){
    sendrequest(messsage);
});

//var query = file
function sendrequest(data){
    data.line = 12;

    var form = new FormData();
    form.append("snippet",data.snippet);
    form.append("url",data.url);
    form.append("line",data.line);

    //alert("sendquery  "+data.snippet+"   "+data.url);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8880", false);
    //xhr.setRequestHeader("Content-type","form-data");
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        //alert("uhuuuuu!!!");
      }
    }

    xhr.send(form);
	//$.post('127.0.0.1:8880',data,acceptedQuery(returnMessage));
	// requests from the server with the query
}
// if returns, send data to return
function acceptedQuery(returnMessage){
	alert(returnMessage);
	// send data to post if successful, and retrieve the URLs
	//$.get(localhost,getFromServer(data))

}

function getFromServer(data){

	var groupedData = data
	for (i = 0; i < data.length; i++) { 


	}

	//send the data to the frame

}
//on localhost
//server 8880
