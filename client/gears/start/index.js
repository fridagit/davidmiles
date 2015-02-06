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
            var page = ctx.params.page;
            if (page.indexOf('#') === 0) {
                page = page.substr(1);
                if (!firstRender) {
                    bus.publish('main-content', page);
                } else {
                    firstRender = false;
                    localStorage.setItem('selected-section', page);
                    main.render();
                }
            }
        }
    );
};

exports.controllers = [];