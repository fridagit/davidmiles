var request = require('data-request');

var viewModel = {
    init: function (params) {
        var self = this;
        var mainContent = $('.mainContent');
        this.width = mainContent.width();
        this.height = mainContent.height() - 80;
        request.getJson(params.jsonName, function (images) {
            setTimeout(function () {
                images.forEach(function (image) {
                    image.caption = image.text;
                    image.img = image.url;
                    image.thumb = image.url;
                    image.full = image.url;
                });
                $('.fotorama').fotorama({
                    data: images,
                    allowfullscreen: true,
                    autoplay: '5000',
                    loop: true,
                    arrows:'always',
                    shuffle: true
                });
            }, 0);
        });
    }
};


module.exports.create = function (params) {
    var vm = Object.create(viewModel);
    vm.init(params);
    return vm;
};
