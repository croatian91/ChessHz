document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    var login = document.getElementsByName("Submit");

    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }

    login[0].onclick = function () {
        
    }
});

