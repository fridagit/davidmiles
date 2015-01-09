var template = require('./template');
var viewModel = require('./view-model');

exports.init = function () {
    ko.components.register('gallery', component);
};

var component = {
    viewModel: {
        'createViewModel': viewModel.create
    },
    template: template
};