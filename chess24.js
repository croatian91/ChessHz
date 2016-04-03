$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});

    port.onMessage.addListener(function (msg) {
        console.log(msg);
    });

    $('.notationList').on('DOMNodeInserted', function (e) {
        if ($(e.target).hasClass('move')) {
            /*var moves = new Array();

             $('.move').each(function () {
             moves.push($(this).text());
             });

             port.postMessage(JSON.stringify({job: 'getBestMove', moves: moves}));*/
            console.log($(e.target).baseURI);
        }
    });
});
