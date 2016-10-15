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

    function milli(time) {
        return (time && time.length > 1) ? (time[0] * 60000 + parseInt(time[1]) * 1000) : null;
    }

    function pgn() {
        var moves = [];
        var wname = $('.username.white').text().replace(/ (.*?)$/g, '');
        var bname = $('.username.black').text().replace(/ (.*?)$/g, '');

        $('turn').filter(function () {
            return $(this).text().length > 0;
        }).each(function () {
            moves.push($('index', this).text() + '.' +
                $('move', this).first().text() + ' ' +
                $('move', this).last().text());
        });

        return [
            '[Event "Casual Game"]',
            '[Site "Lichess.org"]',
            '[Date ""]',
            '[Round "?"]',
            '[Result "*"]',
            '[White "' + wname + '"]',
            '[Black "' + bname + '"]',
            '[WhiteElo "?"]',
            '[BlackElo "?"]',
            '',
            moves.join(' ')
        ].join('\n');
    }

    // $.get(chrome.extension.getURL('/gauge.html'), function (data) {
    //     $(data).appendTo('.lichess_ground');
    // });

    port.onMessage.addListener(function (response) {
        //var squares = ($('.cg-board').hasClass('orientation-white')) ? $('square').get() : $('square').get().reverse();
        var info = JSON.parse(response).info;

        console.log(info);
    });

    $('.moves').on('DOMNodeInserted	', function (e) {
        if ($(e.target).hasClass('result')) {
            console.log('Game Over');
        } else if ($(e.target).is('move.active, div.moves')) {
            var moves = [];
            var wtime = $('.clock_white > .time').text().split(':');
            var btime = $('.clock_black > .time').text().split(':');

            $('move').filter(function () {
                return $(this).text().length > 0;
            }).each(function () {
                moves.push($(this).text());
            });

            port.postMessage(JSON.stringify({
                job: 'analyze',
                moves: moves,
                wtime: parseInt(milli(wtime)),
                btime: parseInt(milli(btime))
            }));

            // chrome.storage.sync.get('show-best-move', function (item) {
            //     if (item['show-best-move'] === true)
            //         port.postMessage(JSON.stringify({
            //             job: 'analyse',
            //             moves: moves,
            //             wtime: parseInt(milli(wtime)),
            //             btime: parseInt(milli(btime))
            //         }));
            // });
        }
    });
    console.log('CoreHz - Injection completed. Have fun!');
});

