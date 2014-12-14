var router = require('router');
var webStorage = require('web-storage');
var bus = require('message-bus');

var viewModel = {
    init: function () {
        this.image = ko.observable('img/affisch_300.jpg');
    }
};

module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
