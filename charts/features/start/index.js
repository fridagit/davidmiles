var router = require('router');
var layout = require('layout-engine');

var dataRequest = require('data-request');
var loadingIndicator = require('loading-indicator');
var header = require('header');
var webStorage = require('web-storage');


function handleRouteWithContext(ctx) {

    header.render();
    layout.render('<div></div>', {}, 'main');
}

exports.start = function () {
    router.on('/', handleRouteWithContext);
};


exports.controllers = [];