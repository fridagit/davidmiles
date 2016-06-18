var router = require('router');
var login = require('login');

module.exports = {
    init: function () {
        this.isLoggedIn = login.isLoggedIn;
    },

    login: function () {
        router.navigate('/#login');
    },

    logout: function () {
        login.logout();
    }
};