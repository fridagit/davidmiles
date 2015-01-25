var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        this.podcasts = ko.observableArray();
        self.selectedUrl = ko.observable();
        request.getJson('podcast', function (podcasts) {
            podcasts.forEach(function (podcast) {
                podcast.url = 'http://sjowallmiles.podomatic.com/entry/' + podcast.podomaticId;
            });
            self.podcasts(podcasts);
        });
    },
    dispose: function () {
        this.podcasts().forEach(function (podcast) {
            podcast.selected.dispose();
        });
    }
};
