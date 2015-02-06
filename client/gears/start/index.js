var router = require('router');
var main = require('main');
var bus = require('message-bus');

exports.start = function () {
    var firstRender = true;
    router.on('/', function (ctx) {
            main.render();
            firstRender = false;
        }
    );
    router.on('/:page', function (ctx) {
            if (!firstRender) {
                bus.publish('main-content', ctx.params.page);
            } else {
                firstRender = false;
                localStorage.setItem('selected-section', ctx.params.page);
                main.render();
            }
        }
    );
};

exports.controllers = [];