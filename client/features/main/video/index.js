var layoutEngine = require('layout-engine');
var template = require('./template');
var viewModel = require('./view-model');

exports.component = {
    viewModel: {
        'createViewModel': viewModel.create
    },
    template: template
};