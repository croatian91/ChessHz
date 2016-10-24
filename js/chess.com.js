$(document).ready(function () {
    var port = chrome.runtime.connect({name: "easy-chess"});
    var gauge = null;
    const MIN = -10.0;
    const MAX = 10.0;

    $.get(chrome.extension.getURL('/status.html'), function (data) {
        $('#LiveChessMainContainer').after(data);

        gauge = new JustGage({
            id: "gauge",
            value: 0.0,
            min: MIN,
            max: MAX,
            reverse: true,
            title: "Evaluation",
            gaugeColor: '#FFFFFF',
            levelColors: ['#000000'],
            refreshAnimationTime: 150,
            decimals: 2
        });

        gauge.txtMin.attr({
            "text": MIN
        });

        gauge.txtMax.attr({
            "text": MAX
        });
    });

    port.onMessage.addListener(function (data) {
        var response = JSON.parse(data);

        console.log(response);

        if (response &&
            response.hasOwnProperty('info') &&
            response.hasOwnProperty('turn') &&
            response.info.length > 0) {
            var turn = (response.turn === 'w') ? 1 : -1;
            var type = response.info[0].score.type;
            var val = (type === 'cp') ? response.info[0].score.value * turn / 100 : ((turn > 0) ? MAX : MIN);

            gauge.refresh(val);

            if (type === 'mate')
                gauge.txtValue.attr({
                    "text": response.info[0].score.value
                });

            gauge.txtLabel.attr({
                "text": type
            });

            $('span#ChessHz-message').text('Best move: ' + response.info[0].pv[0]);
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

            port.postMessage(JSON.stringify({
                'job': 'analyze',
                'moves': moves
            }));
        }
    });
    console.log('CoreHz - Injection completed. Have fun!');
})
;
