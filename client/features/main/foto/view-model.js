var viewModel = {
    init: function () {
        var images = [
            {url: 'affisch_300', width: '239px', height: '300px'},
            {url: 'affisch_300', width: '239px', height: '300px'}
        ];
        images.forEach(function (image) {
            image.url = 'url(img/' + image.url + '.jpg)';

        });
        this.images = images;
    }
};

module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
