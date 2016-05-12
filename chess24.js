$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});
    var coords = {
        'a8': '70', 'a7': '60', 'a6': '50', 'a5': '40', 'a4': '30', 'a3': '20', 'a2': '10', 'a1': '00',
        'b8': '71', 'b7': '61', 'b6': '51', 'b5': '41', 'b4': '31', 'b3': '21', 'b2': '11', 'b1': '01',
        'c8': '72', 'c7': '62', 'c6': '52', 'c5': '42', 'c4': '32', 'c3': '22', 'c2': '12', 'c1': '02',
        'd8': '73', 'd7': '63', 'd6': '53', 'd5': '43', 'd4': '33', 'd3': '23', 'd2': '13', 'd1': '03',
        'e8': '74', 'e7': '64', 'e6': '54', 'e5': '44', 'e4': '34', 'e3': '24', 'e2': '14', 'e1': '04',
        'f8': '75', 'f7': '65', 'f6': '55', 'f5': '45', 'f4': '35', 'f3': '25', 'f2': '15', 'f1': '05',
        'g8': '76', 'g7': '66', 'g6': '56', 'g5': '46', 'g4': '36', 'g3': '26', 'g2': '16', 'g1': '06',
        'h8': '77', 'h7': '67', 'h6': '57', 'h5': '47', 'h4': '37', 'h3': '27', 'h2': '17', 'h1': '07'
    };

    port.onMessage.addListener(function (msg) {
        var bestmove = JSON.parse(msg).bestResponse.moveToPlay;
        var f = $('._' + coords[bestmove.from]);
        var t = $('._' + coords[bestmove.to]);

        $('.cell').each(function () {
            $(this).css('background-color', 'inherit');
        });

        f.css("background-color", "red");
        t.css("background-color", "red");

        console.log(msg);
    });

    $('.current').on('DOMNodeInserted', function (e) {
        if ($(e.target).hasClass('notiBox')) {
            var moves = new Array();
            var wtime = $('.white > .runningTime').text().split(':');
            var btime = $('.black > .runningTime').text().split(':');

            $('.move').each(function () {
                moves.push($(this).text().replace(/[^a-zA-Z0-9+-]+/g, ''));
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
