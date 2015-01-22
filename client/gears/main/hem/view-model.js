var bus = require('message-bus');

module.exports = {
    init: function () {

    },
    goToTrubadur: function() {
        bus.publish('main-content', 'info-trubadur');
    },
    goToPodcast: function() {
        bus.publish('main-content', 'podcast');
    }

};