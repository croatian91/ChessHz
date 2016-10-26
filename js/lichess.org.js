$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});

    init(WebsitesEnum.LICHESS);

    port.onMessage.addListener(function (message) {
        try {
            var response = JSON.parse(message);
            var orientation = $('.lichess_board > .cg-board-wrap > .orientation-white').length > 0;
            var size = $('square').first().width();

            refresh(response, orientation, size);
        } catch (e) {
            console.error(e)
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

            send(port, moves, wtime, btime);
        }
    });
    console.log('CoreHz - Injection completed. Have fun!');
});