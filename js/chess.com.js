/**
 * Created by croatian91 on 24/03/16.
 */

$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});

    port.onMessage.addListener(function (data) {
        var msg = JSON.parse(data);
        var best = (msg.best !== undefined) ? msg.best.bestmove.from + msg.best.bestmove.to : 'none';
        var ponder = (msg.best !== undefined) ? msg.best.ponder.from + msg.best.ponder.to : 'none';

        console.log(msg);
        $('span#ChessHz-message').text('Best move: ' + best + ' - ponder: ' + ponder);
    });

    $.get(chrome.extension.getURL('/status.html'), function (data) {
        $('#LiveChessMainContainer').prepend(data);
    });

    $('#LiveChessTopSideBarTabset .tab-content').on('DOMNodeInserted', function (e) {
        if ($(e.target).hasClass('move-timestamp')) {
            var moves = [];

            $('.gotomove').filter(function () {
                return $(this).text().length > 0;
            }).each(function () {
                var move = $(this).text().replace('O-O+', 'O-O');

                moves.push(move);
            });

            port.postMessage(JSON.stringify({
                'job': 'analyze',
                'moves': moves
            }));
        }
    });
    console.log('CoreHz - Injection completed. Have fun!');
})
;
