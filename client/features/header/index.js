var layoutEngine = require('layout-engine');
var template = require('./template');
var viewModel = require('./view-model');


exports.init = function() {

};

exports.render = function () {
    layoutEngine.render(template, viewModel.create(), 'header');
};