/**
 * Created by croatian91 on 01/03/16.
 */

$(document).ready(function () {
    const MIN = -10.0;
    const MAX = 10.0;

    var port = chrome.runtime.connect({name: "easy-chess"});
    var gauge = null;
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

    $.get(chrome.extension.getURL('/status.html'), function (data) {
        $('.table_wrap > div:last-child').before(data);

        gauge = new JustGage({
            id: "gauge",
            value: 0.0,
            min: MIN,
            max: MAX,
            reverse: true,
            title: "Evaluation",
            gaugeColor: '#FFFFFF',
            levelColors: ['#000000'],
            refreshAnimationTime: 150,
            decimals: 2
        });

        gauge.txtMin.attr({
            "text": MIN
        });

        gauge.txtMax.attr({
            "text": MAX
        });
    });

    function milli(time) {
        return (time && time.length > 1) ? (time[0] * 60000 + parseInt(time[1]) * 1000) : null;
    }

    port.onMessage.addListener(function (data) {
        var squares = ($('.cg-board').hasClass('orientation-white')) ? $('square').get() : $('square').get().reverse();
        var response = JSON.parse(data);

        console.log(response);

        if (response &&
            response.hasOwnProperty('info') &&
            response.hasOwnProperty('turn') &&
            response.info.length > 0) {
            var turn = (response.turn === 'w') ? 1 : -1;
            var type = response.info[0].score.type;
            var val = (type === 'cp') ? response.info[0].score.value * turn / 100 : ((turn > 0) ? MAX : MIN);

            gauge.refresh(val);

            if (type === 'mate')
                gauge.txtValue.attr({
                    "text": response.info[0].score.value
                });

            gauge.txtLabel.attr({
                "text": type
            });

            $('span#ChessHz-message').text('Best move: ' + response.info[0].pv[0]);
        }
    });

    $('.moves').on('DOMNodeInserted	', function (e) {
        if ($(e.target).hasClass('result')) {
            $('span#ChessHz-message').text('Game Over');
        } else if ($(e.target).is('move.active, div.moves')) {
            var moves = [];
            var wtime = $('.clock_white > .time').text().split(':');
            var btime = $('.clock_black > .time').text().split(':');

            $('move').filter(function () {
                return $(this).text().length > 0;
            }).each(function () {
                var move = $(this).text().replace('O-O+', 'O-O').replace('х', 'x');

                moves.push(move);
            });

            port.postMessage(JSON.stringify({
                'job': 'analyze',
                'moves': moves,
                'wtime': parseInt(milli(wtime)),
                'btime': parseInt(milli(btime))
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

