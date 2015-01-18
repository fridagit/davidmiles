var request = require('data-request');

var viewModel = {
    init: function (params) {
        var self = this;
        this.images = ko.observableArray();
        request.getJson(params.jsonName, function (images) {
            self.images(images);
            setTimeout(function () {
                var mainContentDiv = $($('.mainContent > div')[0]); // jshint ignore:line
                var height = mainContentDiv.height();
                var width = mainContentDiv.width();
                var maxHeight = width * 480 / 533;
                if (maxHeight > height) {
                    maxHeight = height;
                }
                $('.pgwSlideshow').pgwSlideshow({maxHeight: maxHeight, autoSlide: true, transitionEffect: 'fading'}); // jshint ignore:line
            }, 0);
        });
    }
};


module.exports.create = function (params) {
    var vm = Object.create(viewModel);
    vm.init(params);
    return vm;
};
