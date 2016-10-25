$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});

    init();

    port.onMessage.addListener(function (message) {
        try {
            var response = JSON.parse(message);

            refresh(response);
        } catch (e) {
            console.error(e)
        }
    });

    $('#LiveChessTopSideBarTabset').find('.tab-content').on('DOMNodeInserted', function (e) {
        if ($(e.target).hasClass('move-timestamp')) {
            var moves = [];

            $('.gotomove').filter(function () {
                return $(this).text().length > 0;
            }).each(function () {
                var move = $(this).text().replace('O-O+', 'O-O');

                moves.push(move);
            });

            send(port, moves);
        }
    });
    console.log('CoreHz - Injection completed. Have fun!');
})
;
