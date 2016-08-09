$(document).ready(function () {
    $('a').each(function () {
        $(this).on('click', function () {
            chrome.tabs.create({active: true, url: $(this).attr('href')});
        });
    });

    $('#submit').on('click', function (e) {
        var name = $('#username').val();
        var pw = $('#password').val();
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:3000/auth",
            "method": "POST",
            "headers": {
                "jsonp": false,
                "name": name,
                "password": pw,
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "name": name,
                "password": pw
            },
            success: function (data, textStatus, jqXHR) {
                if (data.success === true) {
                    location.href = 'settings.html';
                    chrome.browserAction.setPopup({
                        popup: "settings.html"
                    });
                } else {
                    $('#alert-msg').text(data.msg);
                    $('.alert').css('display', 'block');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#alert-msg').text(errorThrown);
                $('.alert').css('display', 'block');
            }
        };

        e.preventDefault();

        $.ajax(settings);
    });
});