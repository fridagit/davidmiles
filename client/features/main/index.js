var layoutEngine = require('layout-engine');
var template = require('./template');
var viewModel = require('./view-model');

exports.init = function() {
    ['discografi','foto','video', 'erbjuder'].forEach(function(name) {
        var component = require('./' + name).component;
        ko.components.register(name, component);
    });

};

exports.render = function () {
    layoutEngine.render(template, viewModel.create(), 'main');
};