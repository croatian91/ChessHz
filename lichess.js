/**
 * Created by croatian91 on 01/03/16.
 */

$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});

    $('.cg-board').on('DOMNodeInserted', function (e) {
        if($(e.target).context.nodeName === 'PIECE'){
            var moves = new Array();
            var wtime = $('.clock_white > .time').text();
            var btime = $('.clock_black > .time').text();

            $('move').each(function () {
                moves.push($(this).text());
            });

            port.postMessage(JSON.stringify({job: 'getBestMove', moves: moves, wtime: wtime, btime: btime}));
        }
    });
});

