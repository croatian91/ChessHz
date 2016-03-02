$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});

    $('.Moves').on('DOMNodeInserted', function (e) {
        console.log(e.target);
        /*var moves = new Array();

        $('move').each(function () {
            moves.push($(this).text());
        });

        port.postMessage(JSON.stringify({job: 'getBestMove', moves: moves}));*/
    });
});
