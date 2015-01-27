var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        this.lyrics = ko.observableArray();
        self.selected = ko.observable();
        request.getJson('texter', function (lyricsList) {
            lyricsList.forEach(function (lyricsItem) {
                request.getText(lyricsItem.textFile, function (text) {
                    lyricsItem.text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
                    lyricsItem.selected = ko.observable(false);
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
                    self.lyrics.push(lyricsItem);
                });
            });
        });
    }
};