var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        this.items = ko.observableArray();
        request.getJson('recensioner', function (items) {
            items.forEach(function(item) {
                item.hasImage = item.albumImage !== undefined;
                item.hasText = item.text !== undefined;
            });
            self.items(items);
        });
    }
};