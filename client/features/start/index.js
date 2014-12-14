var router = require('router');
var layout = require('layout-engine');

var header = require('header');
var main = require('main');


exports.start = function () {
    router.on('/', function (ctx) {
            header.render();
            main.render();
        }
    );
};


exports.controllers = [];