'use strict';

const MIN = -10.0;
const MAX = 10.0;

/**
 * @enum
 * @type {{LICHESS: number, CHESS: number, CHESS24: number, selectors: {1: {board: string, container: string, size: string}, 2: {board: string, container: string, size: string}, 3: {board: string, container: string, size: string}}}}
 */
var WebsitesEnum = {
    LICHESS: 1,
    CHESS: 2,
    CHESS24: 3,
    selectors: {
        1: {
            board: '.top .cg-board',
            container: '.table_wrap > div:last-child'
        },
        2: {
            board: '',
            container: ''
        },
        3: {
            board: '.svg',
            container: 'div.right > div.top'
        }
    }
};

var gauge;

/**
 * Initialization.
 *
 * @param website need to know which website we are deeling with.
 */
function init(website) {
    $.get(chrome.extension.getURL('/status.html'), function (data) {
        var fromSquare = $('<div>', {
            'id': 'ChessHz-square-from',
            'class': 'ChessHz-square',
            'style': 'position: absolute; ' +
            'z-index: 1; ' +
            'opacity: 0.7; ' +
            'background-color: #7ef502;'
        }), toSquare = $('<div>', {
            'id': 'ChessHz-square-to',
            'class': 'ChessHz-square',
            'style': 'position: absolute; ' +
            'z-index: 1; ' +
            'opacity: 0.7; ' +
            'background-color: #f55252;'
        });
        var enabled = true;
        var board = $(WebsitesEnum.selectors[website].board);

        //Inject status.
        $(WebsitesEnum.selectors[website].container).before(data);

        chrome.storage.sync.get('enable-app', function (item) {
            if (item['enable-app'] === false) {
                enabled = false;
            }
        });

        chrome.storage.sync.get('show-gauge', function (item) {
            if (item['show-gauge'] === false || !enabled)
                $('#ChessHz-gauge').hide();
        });

        chrome.storage.sync.get('highlight-squares', function (item) {
            if (item['highlight-squares'] === false || !enabled)
                $('.ChessHz-square').hide();
        });

        chrome.storage.sync.get('show-best-move', function (item) {
            if (item['show-best-move'] === false || !enabled)
                $('#ChessHz-status').hide();
        });

        chrome.runtime.onMessage.addListener(
            function (request) {
                if (request != undefined && request.hasOwnProperty('setting') && request.hasOwnProperty('state')) {
                    var state = request.state;
                    var b = $('#ChessHz-status');
                    var g = $('#ChessHz-gauge');
                    var s = $('.ChessHz-square');

                    switch (request.setting) {
                        case 'enable-app':
                            if (state) {
                                g.fadeIn('fast');
                                b.fadeIn('fast');
                                s.fadeIn('fast');
                            } else {
                                g.fadeOut('fast');
                                b.fadeOut('fast');
                                s.fadeOut('fast');
                            }
                            break;
                        case 'show-gauge':
                            (state) ? g.fadeIn('fast') : g.fadeOut('fast');
                            break;
                        case 'show-best-move':
                            (state) ? b.fadeIn('fast') : b.fadeOut('fast');
                            break;
                        case 'highlight-squares':
                            (state) ? s.fadeIn('fast') : s.fadeOut('fast');
                            break;
                        default:
                            break;
                    }
                }
            }
        );

        fromSquare.appendTo(board);
        toSquare.appendTo(board);

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
}

/**
 * Send new position to the server.
 *
 * @param port
 * @param moves array of moves in SAN.
 * @param wtime white time remaining in milliseconds.
 * @param btime black time remaining in milliseconds.
 */
function send(port, moves, wtime, btime) {
    chrome.storage.sync.get('enable-app', function (item) {
        if (item['enable-app'] === true)
            port.postMessage(JSON.stringify({
                'job': 'analyze',
                'moves': moves,
                'wtime': parseInt(milliseconds(wtime)),
                'btime': parseInt(milliseconds(btime))
            }));
    });
}

/**
 * Converts time in milliseconds.
 *
 * @param time
 * @returns {*} time in milliseconds or null.
 */
function milliseconds(time) {
    return (time !== undefined && time.length > 1) ? (time[0] * 60000 + parseInt(time[1]) * 1000) : null;
}

/**
 * Returns the offset of the square.
 *
 * @param letter e.g. e2 => e.
 * @param number e.g. e2 => 2.
 * @param orientation white or black oriented board.
 * @param size width or height of the square.
 * @returns {{top: number, left: number}}
 */
function offset(letter, number, orientation, size) {
    var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    var numbers = ['8', '7', '6', '5', '4', '3', '2', '1'];

    return (orientation) ?
    {top: numbers.indexOf(number) * size, left: letters.indexOf(letter) * size} :
    {top: numbers.reverse().indexOf(number) * size, left: letters.reverse().indexOf(letter) * size};
}

/**
 * Highlight squares corresponding to engine's response.
 *
 * @param from initial square.
 * @param to final square.
 * @param orientation white or black oriented board.
 * @param size width or height of the square.
 */
function highlightSquares(from, to, orientation, size) {
    var fromOffset = offset(from.substring(0, 1), from.substring(1, 2), orientation, size);
    var toOffset = offset(to.substring(0, 1), to.substring(1, 2), orientation, size);
    var fromSquare = $('#ChessHz-square-from');
    var toSquare = $('#ChessHz-square-to');

    fromSquare.parent().css({position: 'relative'});
    fromSquare.css({
        top: fromOffset.top,
        left: fromOffset.left,
        width: size,
        height: size,
        position: 'absolute'
    });

    toSquare.css({
        top: toOffset.top,
        left: toOffset.left,
        width: size,
        height: size,
        position: 'absolute'
    });
}

/**
 * Sends coordinates and offset to the bot.
 *
 * @param port
 * @param offset size / 2 => center of the square.
 */
function move(port, offset) {
    var from = $('#ChessHz-square-from').offset();
    var to = $('#ChessHz-square-to').offset();

    port.postMessage(JSON.stringify({
        "job": "move",
        "from": {"x": from.left + window.screenX, "y": from.top + window.screenY + 60},
        "to": {"x": to.left + window.screenX, "y": to.top + window.screenY + 60},
        "offset": offset
    }));
}

/**
 * Refresh the client e.g. gauge, highlighted squares.
 *
 * @param response output of the uci.
 * @param orientation white or black oriented board.
 * @param size width or height of the square.
 * @param response.bestmove
 * @param response.info.score.value
 * @param response.info.score.type
 * @param response.info.pv
 * @param response.turn
 * @param response.promotion
 * @param response.from
 * @param response.to
 */
function refresh(response, orientation, size) {
    if (response !== undefined &&
        response.info.length > 0 &&
        response.hasOwnProperty('info') &&
        response.hasOwnProperty('turn') &&
        response.hasOwnProperty('bestmove')
    ) {
        var turn = (response.turn === 'w') ? 1 : -1;
        var type = response.info[0].score.type;
        var val = (type === 'cp') ? response.info[0].score.value * turn / 100 : ((turn > 0) ? MAX : MIN);
        var bestMove = response.bestmove.bestmove;

        console.log(response);

        gauge.refresh(val);
    }

    if (type === 'mate')
        gauge.txtValue.attr({
            "text": response.info[0].score.value
        });

    gauge.txtLabel.attr({
        "text": type
    });

    highlightSquares(bestMove.from, bestMove.to, orientation, size);

    $('span#ChessHz-message').text(
        'bestmove: ' + bestMove.from + bestMove.to + bestMove.promotion);
}