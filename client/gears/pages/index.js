var layoutEngine = require('layout-engine');
var template = require('./template');
var viewModel = require('./view-model').create();
var request = require('data-request');

var urlPage;

exports.init = function () {
    request.getJson('menu', function (sections) {
        sections.forEach(function (section) {
            if (!section.header) {
                var name = section.id || section.text.toLowerCase();
                if (section.category) {
                    name = section.category + '/' + name;
                }
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
        viewModel.createSections(urlPage);
    });
};

exports.render = function (page) {
    urlPage = page;
    layoutEngine.render(template, viewModel, 'site');
};