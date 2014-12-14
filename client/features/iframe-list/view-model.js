var viewModel = {
    init: function (params) {
        var self = this;
        self.items = params.urls.map(function (url) {
            return {
                url: url,
                loaded: ko.observable(false),
                width: params.width,
                height: params.height
            };
        });
        self.loaded = ko.observable(false);
        self.afterRender = function (data, toBeTriggered) {
            var iFrame = data[1];
            var that = self;
            iFrame.onload = function () {
                toBeTriggered.loaded(true);
                var loaded = self.items.every(function (item) {
                    return item.loaded();
                });
                self.loaded(loaded);
            };
        };
    }
};

module.exports.create = function (params) {
    var vm = Object.create(viewModel);
    vm.init(params);
    return vm;
};
