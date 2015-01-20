var request = require('data-request');

function setSize(obj) {
    var mainContent = $('.mainContent');
    obj.width = mainContent.width();
    obj.height = mainContent.height() - 80;
}
var viewModel = {
    init: function (params) {
        var self = this;
        setSize(this);
        request.getJson(params.jsonName, function (images) {
            setTimeout(function () {
                images.forEach(function (image) {
                    image.caption = image.text;
                    image.img = image.url;
                    image.thumb = image.url;
                    image.full = image.url;
                });
                var fotorama = $('.fotorama').fotorama({
                    data: images,
                    allowfullscreen: true,
                    autoplay: '5000',
                    loop: true,
                    arrows: 'always',
                    shuffle: true
                });
                $(window).resize(function () {
                    var resize = {};
                    setSize(resize);
                    fotorama.resize(resize);
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
