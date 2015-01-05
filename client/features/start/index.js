var router = require('router');
var main = require('main');

exports.start = function () {
    router.on('/', function (ctx) {
            main.render();
        }
    );
};

exports.controllers = [];