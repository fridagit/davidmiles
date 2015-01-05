var viewModel = {
    init: function () {
        var images = [];
        for (var i = 1; i <= 22; i++) {
            images.push(
                {
                    thumb: 'img/press/david_press_' + i + '_thumbnail.jpg',
                    url: 'img/press/david_press_' + i + '.jpg'
                }
            );
        }
        this.images = images;
    }
};

module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
