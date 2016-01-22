var template = require('./template');
var viewModel = require('./view-model');

exports.init = function () {
    ko.components.register('editable', component);
};

var component = {
    viewModel: {
        'createViewModel': viewModel.create
    },
    template: template
};