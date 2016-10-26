var ws = new WebSocket("ws://localhost:1337/");

chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (request) {
        ws.send(request);
    });

    ws.onmessage = function (event) {
        port.postMessage(event.data);
    };
});

chrome.extension.onMessage.addListener(function (request) {
    if (request !== undefined)
        ws.send(request);
});




