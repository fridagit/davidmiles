var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        this.lyrics = ko.observableArray();
        self.selected = ko.observable();
        self.allTexts = ko.observable('');
        self.editMode = ko.observable(false);
        request.getTxt('lyrics', function (allTexts) {
            self.allTexts(allTexts);
            var currentLyricsItem;
            allTexts.split(/(?:\r\n|\r|\n)/g).forEach(function (line) {
                if (line.trim().indexOf('#') === 0) {
                    if (currentLyricsItem !== undefined) {
                        self.lyrics.push(currentLyricsItem);
                    }
                    var title = line.trim().substr(1).trim();
                    currentLyricsItem = self.newLyricsItem(title);
                }
                else {
                    if (currentLyricsItem !== undefined) {
                        currentLyricsItem.text = currentLyricsItem.text + line + '\n';
                    }
                }
            });
        });

    },
    newLyricsItem: function (title) {
        var lyricsItem = {};
        lyricsItem.text = '';
        lyricsItem.title = title;
        lyricsItem.selected = ko.observable(false);
        var self = this;
        lyricsItem.click = function () {
            if (lyricsItem.selected()) {
                lyricsItem.selected(false);
            } else {
                self.lyrics().forEach(function (item) {
                    item.selected(false);
                });
                lyricsItem.selected(true);
            }
        };
        return lyricsItem;
    }
}
;