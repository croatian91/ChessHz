var ws = new WebSocket("ws://localhost:1337/");

chrome.runtime.onConnect.addListener(function (p) {
    p.onMessage.addListener(function (msg) {
        ws.send(msg);
    });

    ws.onmessage = function (event) {
        console.log(event.data);
        p.postMessage(event.data);
    };
});


