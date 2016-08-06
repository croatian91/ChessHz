$(document).ready(function () {
    $('a').each(function () {
        $(this).on('click', function () {
            chrome.tabs.create({active: true, url: $(this).attr('href')});
        });
    });

    $('#submit').on('click', function () {
        var data = {
            username: $('#username').val(),
            password: $('#password').val()
        };

        $.ajax({
            type: "POST",
            url: "https://www.chesshz.top/login",
            data: JSON.stringify(data),
            success: function (res) {
                console.log(res);
            },
            error: function (xhr, status) {
                $(".alert").css("display", "block");
            }
        });
    });
});

