$(document).ready(function () {
    (function ($) {
        var checkboxes = $("[type='checkbox']");
        var strengthSlider = $('#strength-slider');
        var token = '';

        checkboxes.bootstrapSwitch('size', 'mini');

        strengthSlider.slider();

        strengthSlider.on('slideStop', function () {
            var o = {};
            var value = $(this).data('slider').getValue();

            o['strength-slider'] = value;

            chrome.storage.sync.set(o);
            chrome.runtime.sendMessage(
                JSON.stringify({
                    job: 'setOption',
                    setting: 'Skill Level',
                    value: value
                }));
        });

        chrome.storage.sync.get('strength-slider', function (item) {
            $('#strength-slider').slider('setValue', item['strength-slider']);
        });

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

            chrome.tabs.query({url: ['https://*.lichess.org/*', 'https://chess24.com/*/game/*']}, function (tabs) {
                tabs.forEach(function (tab) {
                    chrome.tabs.sendMessage(tab.id, {setting: setting, state: state});
                });
            });
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