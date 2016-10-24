/**
 * Created by croatian91 on 01/03/16.
 */

$(document).ready(function () {
    const MIN = -10.0;
    const MAX = 10.0;

    var port = chrome.runtime.connect({name: "easy-chess"});
    var gauge = null;
    var board = $('.top .cg-board');

    var fromSquare = $('<div>', {
        'id': 'ChessHz-square-from',
        'style': 'position: absolute; ' +
        'z-index: 1; ' +
        'opacity: 0.7; ' +
        'background-color: #7ef502;'
    }), toSquare = $('<div>', {
        'id': 'ChessHz-square-to',
        'style': 'position: absolute; ' +
        'z-index: 1; ' +
        'opacity: 0.7; ' +
        'background-color: #f55252;'
    });

    fromSquare.appendTo(board);
    toSquare.appendTo(board);

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

    function offset(a, b, size) {
        var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        var numbers = ['8', '7', '6', '5', '4', '3', '2', '1'];

        return ($('.top .cg-board').hasClass('orientation-white')) ?
        {top: numbers.indexOf(a) * size, left: letters.indexOf(b) * size} :
        {top: numbers.reverse().indexOf(a) * size, left: letters.reverse().indexOf(b) * size};
    }

    function highlightSquares(from, to) {
        var size = $('square').first().width();
        var fromOffset = offset(from.substring(1, 2), from.substring(0, 1), size);
        var toOffset = offset(to.substring(1, 2), to.substring(0, 1), size);

        fromSquare.parent().css({position: 'relative'});
        fromSquare.css({
            top: fromOffset.top,
            left: fromOffset.left,
            width: size,
            height: size,
            position: 'absolute'
        });

        toSquare.parent().css({position: 'relative'});
        toSquare.css({
            top: toOffset.top,
            left: toOffset.left,
            width: size,
            height: size,
            position: 'absolute'
        });
    }

    port.onMessage.addListener(function (data) {
        var response = JSON.parse(data);

        console.log(response);

        if (response &&
            response.hasOwnProperty('info') &&
            response.hasOwnProperty('turn') &&
            response.info.length > 0) {
            var turn = (response.turn === 'w') ? 1 : -1;
            var type = response.info[0].score.type;
            var val = (type === 'cp') ? response.info[0].score.value * turn / 100 : ((turn > 0) ? MAX : MIN);
            var from = response.info[0].pv[0].substring(0, 2);
            var to = response.info[0].pv[0].substring(2, 4);

            gauge.refresh(val);

            if (type === 'mate')
                gauge.txtValue.attr({
                    "text": response.info[0].score.value
                });

            gauge.txtLabel.attr({
                "text": type
            });

            highlightSquares(from, to);

            $('span#ChessHz-message').text('Best move: ' + response.info[0].pv[0]);
        }
    });

    $('.moves').on('DOMNodeInserted	', function (e) {
        if ($(e.target).hasClass('result')) {
            $('span#ChessHz-message').text('Best move: none');
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

