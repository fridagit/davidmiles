var template = require('./template');
var viewModel = require('./view-model');

exports.init = function () {
    ko.components.register('iframe-list', component);
};

var component = {
    viewModel: {
        'createViewModel': viewModel.create
    },
    template: template
};