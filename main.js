var ws = new WebSocket("ws://localhost:1337/");

ws.onmessage = function (event) {
    var data = event.data;
    alert(data);
};

chrome.runtime.onConnect.addListener(function (p) {
    if (p.name == "easy-chess") {
        p.onMessage.addListener(function (msg) {
            ws.send(msg);
        });
    }
});


