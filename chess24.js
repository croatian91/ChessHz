$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});

    port.onMessage.addListener(function (msg) {
        console.log(msg);
    });

    $('.current').on('DOMNodeInserted', function (e) {
        if ($(e.target).hasClass('notiBox')) {
            var moves = new Array();
            var wtime = $('.white > .runningTime').text().split(':');
            var btime = $('.black > .runningTime').text().split(':');

            $('.move').each(function () {
                moves.push($(this).text().replace(/[^a-zA-Z0-9+-]+/g,''));
            });

            port.postMessage(JSON.stringify({
                job: 'getBestMove',
                moves: moves,
                wtime: parseInt(wtime[0]) * 60000 + parseInt(wtime[1]) * 1000,
                btime: parseInt(btime[0]) * 60000 + parseInt(btime[1]) * 1000
            }));
        }
    });
});
