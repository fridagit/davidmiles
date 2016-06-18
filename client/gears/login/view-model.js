var request = require('data-request');
var router = require('router');
var webStorage = require('web-storage');

var viewModel = {
    init: function () {
        this.password = ko.observable();
        this.unauthorized = ko.observable(false);
    },

    login: function () {
        var self = this;
        request.get('/admin/login.php?password=' + this.password(), handleLoginResponse.bind(this));
    },

    submit: function (d, e) {
        e.keyCode === 13 && this.login();
        return true;
    }
};

function handleLoginResponse(res) {
    this.unauthorized(res.unauthorized);
    if (!res.unauthorized) {
        webStorage.store('session', 'password', this.password());
        var prevPage = webStorage.retrieve('session', 'previousPage');
        router.navigate('/#' + prevPage);
        location.reload();
    }
}

module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
