$(document).ready(function () {
    (function ($) {
        var checkboxes = $("[type='checkbox']");
        var token = '';

        checkboxes.bootstrapSwitch('size', 'mini');

        $.each(checkboxes, function (index, value) {
            var setting = $(value).attr('name');

            chrome.storage.sync.get(setting, function (item) {
                $("[name=" + setting).bootstrapSwitch('state', item[setting], true);
            });
        });

        checkboxes.on('switchChange.bootstrapSwitch', function (event, state) {
            var setting = $(this).attr('name');
            var o = {};

            o[setting] = state;
            chrome.storage.sync.set(o);
        });

        chrome.storage.sync.get('token', function (item) {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://localhost:3000/member-info",
                "method": "GET",
                "headers": {
                    "jsonp": false,
                    "authorization": item['token'],
                    "cache-control": "no-cache"
                },
                success: function (data) {
                    if (data.success === true) {
                        $('#test').text(data.msg);
                    } else {
                        alert('error');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            };

            $.ajax(settings)
        });
    })(jQuery);
});