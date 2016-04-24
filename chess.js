/**
 * Created by croatian91 on 24/03/16.
 */

$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});

    port.onMessage.addListener(function (msg) {
        console.log(msg);
    });

    $('.gameBorderContainer').on('DOMNodeInserted', function (e) {
        if ($(e.target).is('.boardContainer')) {
            console.log('target');
            $('.moves_controls').on('DOMNodeInserted', function (e) {
                var moves = new Array();

                $('.gotomove').each(function () {
                    moves.push($(this).text());
                });

                console.log(moves);

                //port.postMessage(JSON.stringify({job: 'getBestMove', moves: moves}));
            });
        }
    });
});
