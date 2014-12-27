var request = require('utils/request');

var viewModel = {
    init: function () {
        this.videos = ['5nMKfLtT9YU','WDnrjwN5X5I','ABF7PrYchNQ','AXf7meAEQnU'];
        this.videos = this.videos.map(function(video) {
            return {
                id: video,
                click: function (item, event) {
                    var element = event.currentTarget;
                    var iframe = document.createElement("iframe");
                    var iframeUrl = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1&origin=http://davidmiles.se";
                    if (element.getAttribute("data-params")) {
                        iframeUrl += '&' + element.getAttribute("data-params");
                    }
                    iframe.setAttribute("src", iframeUrl);
                    iframe.setAttribute("frameborder", '0');
                    iframe.style.width = element.style.width;
                    iframe.style.height = element.style.height;
                    element.parentNode.replaceChild(iframe, element);
                },
                title: ko.observable()
            };
        });
        this.videos.forEach(function(video) {
            request('GET', 'http://gdata.youtube.com/feeds/api/videos/' + video.id + '?alt=json').end(function (result) {
                video.title(result.body.entry.title.$t);
            });
        });
    }
};

module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};