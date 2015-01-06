var layoutEngine = require('layout-engine');
var template = require('./template');
var viewModel = require('./view-model');

exports.init = function () {
    var pages = ['discografi', 'foto', 'video', 'hem'];
    pages.forEach(function (name) {
        var component = {
            viewModel: {
                'createViewModel': function () {
                    var viewModel = require('./' + name + '/view-model');
                    var vm = Object.create(viewModel);
                    vm.init();
                    return vm;
                }
            },
            template: require('./' + name + '/template')
        };
        ko.components.register(name, component);
    });

};

exports.render = function () {
    layoutEngine.render(template, viewModel.create(), 'main');
};