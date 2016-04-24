$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});
    var coords = [
        'a8', 'a7', 'a6', 'a5', 'a4', 'a3', 'a2', 'a1',
        'b8', 'b7', 'b6', 'b5', 'b4', 'b3', 'b2', 'b1',
        'c8', 'c7', 'c6', 'c5', 'c4', 'c3', 'c2', 'c1',
        'd8', 'd7', 'd6', 'd5', 'd4', 'd3', 'd2', 'd1',
        'e8', 'e7', 'e6', 'e5', 'e4', 'e3', 'e2', 'e1',
        'f8', 'f7', 'f6', 'f5', 'f4', 'f3', 'f2', 'f1',
        'g8', 'g7', 'g6', 'g5', 'g4', 'g3', 'g2', 'g1',
        'h8', 'h7', 'h6', 'h5', 'h4', 'h3', 'h2', 'h1'
    ];

    port.onMessage.addListener(function (msg) {
        var squares = ($('.chessGame').hasClass('w')) ? $('.cell').get() : $('.cell').get().reverse();
        var bestmove = JSON.parse(msg).bestmove;

        var f = $(squares[coords.indexOf(bestmove.from)]);
        var t = $(squares[coords.indexOf(bestmove.to)]);

        $(squares).css('background-color', 'inherit');

        f.css("background-color", "red");
        t.css("background-color", "red");
        console.log(msg);
    });

    $('.current').on('DOMNodeInserted', function (e) {
        if ($(e.target).hasClass('notiBox')) {
            var moves = new Array();
            var wtime = $('.white > .runningTime').text().split(':');
            var btime = $('.black > .runningTime').text().split(':');

            $('.move').each(function () {
                moves.push($(this).text().replace(/[^a-zA-Z0-9+-]+/g, ''));
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
