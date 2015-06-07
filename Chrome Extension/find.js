var buffer = null;
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

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://45.33.82.241:8880", true);
    xhr.onreadystatechange = function(data,req) {
      if (xhr.readyState == 4) {
        var jsonResponse = JSON.parse(data.target.responseText);
        document.cookie.buffer = jsonResponse;
        //printOnFrame(jsonResponse);
      }
    }

    xhr.send(form);
}
// if returns, send data to return
function acceptedQuery(data,stat){
    console.log(data,stat);
}