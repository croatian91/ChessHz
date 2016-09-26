$(document).ready(function () {
    $('a').each(function () {
        $(this).on('click', function () {
            chrome.tabs.create({active: true, url: $(this).attr('href')});
        });
    });

    $('#submit').on('click', function (e) {
        var login = $('#login').val();
        var pw = $('#password').val();
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:3000/api/auth",
            "method": "POST",
            "headers": {
                "jsonp": false,
                "login": name,
                "password": pw,
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "login": login,
                "password": pw
            },
            success: function (data, textStatus, jqXHR) {
                if (data.success === true) {
                    chrome.storage.sync.set({'token': data.token});
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