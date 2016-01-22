var request = require('data-request');
var router = require('router');
var webStorage = require('web-storage');

var viewModel = {
    init: function () {
        this.password = ko.observable();
        this.css = ko.observable();
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
    if (res.unauthorized) {
        this.css('redBackground');
    } else {
        this.css('');
        webStorage.store('session', 'password', this.password());
        router.navigate('/#hem');
    }
}

module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
