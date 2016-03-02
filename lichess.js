/**
 * Created by croatian91 on 01/03/16.
 */

$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});

    $('.moves').on('DOMNodeInserted', function (e) {
        if ($(e.target)[0].tagName === 'MOVE' && !$(e.target).hasClass('active')) {
            var moves = new Array();

            $('move').each(function () {
                moves.push($(this).text());
            });

            port.postMessage(JSON.stringify({job: 'getBestMove', moves: moves}));
        }
    });
});

