var request = require('data-request');
var utils = require('dm-utils');

module.exports = {
    init: function () {
        var self = this;
        this.lyrics = ko.observableArray();
        self.selected = ko.observable();
        self.allTexts = ko.observable('');
        self.editMode = ko.observable(false);
        request.getTxt('lyrics', function (allTexts) {
            self.allTexts(allTexts);
            var items = utils.parseTextToItems(allTexts);
            items.forEach(self.newLyricsItem.bind(self));
            self.lyrics(items);
        });

    },
    newLyricsItem: function (item) {
        item.selected = ko.observable(false);
        var self = this;
        item.click = function () {
            if (item.selected()) {
                item.selected(false);
            } else {
                self.lyrics().forEach(function (item) {
                    item.selected(false);
                });
                item.selected(true);
            }
        };
    }
}
;