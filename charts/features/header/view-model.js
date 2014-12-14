var router = require('router');
var webStorage = require('web-storage');

var viewModel = {
    init: function () {
        var self = this;
        this.settings = {
            text: ko.observable('Lirar sköna låtar')
        };
    }
};

module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
