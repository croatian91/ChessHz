/**
 * Created by croatian91 on 24/03/16.
 */

$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});

    port.onMessage.addListener(function (msg) {
        console.log(msg);
        //$('span#ChessHz-message').text(msg);
    });

    // $.get(chrome.extension.getURL('/status.html'), function (data) {
    //     $('#LiveChessMainContainer').prepend(data);
    // });

    $('#LiveChessTopSideBarTabset .tab-content').on('DOMNodeInserted', function (e) {
        if ($(e.target).hasClass('move-timestamp')) {
            var moves = [];

            $('.gotomove').filter(function () {
                return $(this).text().length > 0;
            }).each(function () {
                moves.push($(this).text());
            });

            //console.log(moves);

            port.postMessage(JSON.stringify({job: 'analyze', moves: moves}));
        }
    });
    console.log('CoreHz - Injection completed. Have fun!');
})
;
