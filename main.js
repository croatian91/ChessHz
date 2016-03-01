//var ws = new WebSocket("ws://localhost:1337/");

/*function initEngine() {
 ws.send('0');
 }

 ws.onmessage = function (event) {
 var data = event.data;
 };*/

chrome.runtime.onConnect.addListener(function (p) {
    if (p.name == "easy-chess") {
        p.onMessage.addListener(function (msg) {
            ws.send('1 ' + msg.fen);
        });
    }
});


