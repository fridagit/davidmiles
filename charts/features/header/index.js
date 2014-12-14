var layoutEngine = require('layout-engine');
var template = require('./template');
var viewModel = require('./view-model');

require('./ko.bindings');

exports.render = function () {
    layoutEngine.render(template, viewModel.create(), 'header');
};