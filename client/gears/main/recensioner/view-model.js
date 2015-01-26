var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        this.albums = ko.observableArray();
        request.getJson('recensioner', function (albums) {
            self.albums(albums);
        });
    }
};