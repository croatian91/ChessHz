$(document).ready(function () {
    $("[type='checkbox']").bootstrapSwitch('size', 'mini');
    (function ($) {
        var settings = $("[type='checkbox']");

        $.each(settings, function (index, value) {
            var setting = $(value).attr('name');

            chrome.storage.sync.get(setting, function (item) {
                $("[name=" + setting).bootstrapSwitch('state', item[setting], true);
            });
        });
    })(jQuery);

    $("[type='checkbox']").on('switchChange.bootstrapSwitch', function (event, state) {
        var setting = $(this).attr('name');
        var o = {};

        o[setting] = state;
        chrome.storage.sync.set(o);
    });
});