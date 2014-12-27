var bus = require('message-bus');

var viewModel = {
    init: function () {
        var self = this;
        var selected = localStorage.getItem('selected-section') || 'Foto';
        this.mainContent = ko.observable(selected.toLowerCase());
        bus.subscribe('main-content', function(item) {
            self.mainContent(item.data.toLowerCase());
        });

    }
};

module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
