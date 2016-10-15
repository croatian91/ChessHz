var ws = new WebSocket("ws://localhost:1337/");
var port = null;

// function connect() {
//     console.log("connect");
//     port = chrome.runtime.connectNative(hostName);
// }

function sendNativeMessage() {
    message = {"text": document.getElementById('input-text').value};
    port.postMessage(message);
}

chrome.runtime.onConnect.addListener(function (p) {
    p.onMessage.addListener(function (msg) {
        ws.send(msg);
    });

    ws.onmessage = function (event) {
        p.postMessage(event.data);
    };
});




