var layoutEngine = require('layout-engine');
var template = require('./template');
var viewModel = require('./view-model');
var request = require('data-request');

exports.init = function () {
    request.getJson('menu', function (sections) {
        sections.forEach(function (section) {
            if (!section.header) {
                var name = section.id || section.text.toLowerCase();
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
            }
        });
    });
};

exports.render = function () {
    layoutEngine.render(template, viewModel.create(), 'site');
};