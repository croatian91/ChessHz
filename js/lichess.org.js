$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});

    init();

    /**
     * @param data.info.score.value
     * @param data.info.score.type
     * @param data.info.pv
     * @param data.turn
     */
    port.onMessage.addListener(function (message) {
        try {
            var response = JSON.parse(message);

            refresh(response);
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

            // chrome.storage.sync.get('show-best-move', function (item) {
            //     if (item['show-best-move'] === true)
            //
            // });
        }
    });
    console.log('CoreHz - Injection completed. Have fun!');
});