var template = require('./template');
var viewModel = require('./view-model');
var webStorage = require('web-storage');

exports.init = function () {
    ko.components.register('login', component);
};

exports.isLoggedIn = function() {
    return exports.getPassword() !== undefined;
};

exports.getPassword = function() {
    return webStorage.retrieve('session', 'password');
};

exports.logout = function() {
    webStorage.clear('session', 'password');
    location.reload();
};

var component = {
    viewModel: {
        'createViewModel': viewModel.create
    },
    template: template
};