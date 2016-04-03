/**
 * Created by croatian91 on 01/03/16.
 */

$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});
    var coords = [
        'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
        'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
        'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
        'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
        'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
        'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
        'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
        'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
    ];

    port.onMessage.addListener(function (msg) {
        var squares = ($('.cg-board').hasClass('orientation-white')) ? $('square').get() : $('square').get().reverse();
        var offset = $('square').first().width() / 2;
        var bestmove = JSON.parse(msg).bestmove;

        var f = $(squares[coords.indexOf(bestmove.from)]);
        var t = $(squares[coords.indexOf(bestmove.to)]);

        $(squares).css('background-color', 'inherit');

        f.css("background-color", "red");
        t.css("background-color", "red");

        console.log(msg);
    });

    $('.moves').on('DOMNodeInserted	', function (e) {
        if ($(e.target).hasClass('active') || $(e.target).hasClass('moves')) {
            var moves = new Array();
            var wtime = $('.clock_white > .time').text().split(':');
            var btime = $('.clock_black > .time').text().split(':');

            $('move').each(function () {
                moves.push($(this).text());
            });

            port.postMessage(JSON.stringify({
                job: 'getBestMove',
                moves: moves,
                wtime: parseInt(wtime[0]) * 60000 + parseInt(wtime[1]) * 1000,
                btime: parseInt(btime[0]) * 60000 + parseInt(btime[1]) * 1000
            }));
        }
    });
});

