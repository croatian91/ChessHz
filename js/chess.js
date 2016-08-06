/**
 * Created by croatian91 on 24/03/16.
 */

$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});

    port.onMessage.addListener(function (msg) {
        console.log(msg);
    });

    $(document).on('DOMNodeInserted', function (e) {
        if ($(e.target).is('.boardContainer')) {
            $('.moves_controls').on('DOMNodeInserted', function (e) {
                var moves = [];

                $('.gotomove').each(function () {
                    moves.push($(this).text());
                });

                console.log(moves);

                port.postMessage(JSON.stringify({job: 'getBestMove', moves: moves}));
            });
        }
    });

    /*function f() {
     console.log('dfsdfsd');
     $('.moves_controls').on('DOMNodeInserted', function (e) {
     var moves = [];

     $('.gotomove').each(function () {
     moves.push($(this).text());
     });

     console.log(moves);

     //port.postMessage(JSON.stringify({job: 'getBestMove', moves: moves}));
     });
     }

     $(".boardContainer").on("DOMNodeInserted", f);*/
});
