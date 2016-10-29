$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});

    init(WebsitesEnum.CHESS24);

    port.onMessage.addListener(function (message) {
        try {
            var response = JSON.parse(message);
            var orientation = $('div.bottom > div.playerInfo.white').length > 0;
            var size = $('.cell').first().width();

            refresh(response, orientation, size);
            move(port, orientation, response.turn, size / 2);

        } catch (e) {
            console.error(e)
        }
    });

    $('.current').on('DOMNodeInserted', function (e) {
        if ($(e.target).hasClass('notiBox')) {
            var moves = [];
            var wtime = $('.white > .runningTime').text().split(':');
            var btime = $('.black > .runningTime').text().split(':');

            $('.move').each(function () {
                var move = $(this).text().replace(/[^a-zA-Z0-9+-]+/g, '');

                moves.push(move);
            });

            send(port, moves, wtime, btime);
        }
    });
    console.log('CoreHz - Injection completed. Have fun!');
});
