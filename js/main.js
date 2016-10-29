var server = new WebSocket("ws://localhost:1337/");
var bot = new WebSocket("ws://localhost:8888/ws");

chrome.extension.onConnect.addListener(function (port) {
    chrome.storage.sync.get('strength-slider', function (item) {
        server.send(JSON.stringify({
            job: 'setOption',
            setting: 'Skill Level',
            value: item['strength-slider']
        }));
    });

    port.onMessage.addListener(function (request) {
        try {
            var data = JSON.parse(request);

            if (data.job === 'analyze')
                server.send(request);
            else if (data.job === 'move')
                bot.send(request);
        } catch (e) {

        }
    });

    server.onmessage = function (event) {
        port.postMessage(event.data);
    };
});

chrome.extension.onMessage.addListener(function (request) {
    if (request !== undefined)
        server.send(request);
});