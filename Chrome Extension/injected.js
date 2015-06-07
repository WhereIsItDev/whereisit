function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    text = text.trim();
    if(text.length>0){
        console.log(text);
        console.log(window.location.href);
        chrome.runtime.sendMessage({
            snippet:text,
            url:window.location.href
        });
    }
}
document.addEventListener("mouseup",getSelectionText);
