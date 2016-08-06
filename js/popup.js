$(document).ready(function () {
    $('a').each(function () {
        $(this).on('click', function () {
            chrome.tabs.create({active: true, url: $(this).attr('href')});
        });
    });

    $('#submit').on('click', function () {
        alert('fdsfssd');
    });
});

