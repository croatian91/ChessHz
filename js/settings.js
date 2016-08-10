$(document).ready(function () {
    (function ($) {
        var settings = $("[type='checkbox']");

        $("[type='checkbox']").bootstrapSwitch('size', 'mini');

        $.each(settings, function (index, value) {
            var setting = $(value).attr('name');

            chrome.storage.sync.get(setting, function (item) {
                $("[name=" + setting).bootstrapSwitch('state', item[setting], true);
            });
        });

        $("[type='checkbox']").on('switchChange.bootstrapSwitch', function (event, state) {
            var setting = $(this).attr('name');
            var o = {};

            o[setting] = state;
            chrome.storage.sync.set(o);
        });
    })(jQuery);
});