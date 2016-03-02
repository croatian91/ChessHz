/**
 * Created by croatian91 on 01/03/16.
 */

$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});
    var i = 0;

    $('.moves').on('DOMNodeInserted', function (e) {
        var moves = new Array();

        $('move').each(function () {
            moves.push($(this).text());
            console.log($(this).text());
        });

        port.postMessage(JSON.stringify({job: 'getBestMove', moves: moves}));
    });
});

