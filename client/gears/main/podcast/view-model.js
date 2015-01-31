var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        this.podcasts = ko.observableArray([{title:'Läser in podcast-listan...', url:''}]);
        request.getJson('podcast', function (podcasts) {
            podcasts.forEach(function (podcast) {
                podcast.url = 'http://sjowallmiles.podomatic.com/entry/' + podcast.podomaticId;
            });
            self.podcasts(podcasts);
        });
    }
};
