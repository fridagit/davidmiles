var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        this.podcasts = ko.observableArray();
        self.selectedUrl = ko.observable();
        request.getJson('podcast', function (podcasts) {
            podcasts.forEach(function (podcast) {
                var url = 'http://sjowallmiles.podomatic.com/embed/frame/posting/' + podcast.podomaticId +
                    '?json_url=http%3A%2F%2Fsjowallmiles.podomatic.com%2Fentry%2Fembed_params%2F' + podcast.podomaticId +
                    '%3Fcolor%3D43bee7%26autoPlay%3Dtrue%26width%3D4500%26height%3D85%26objembed%3D0';
                podcast.click = function () {
                    $('.iFrameLoading').slideDown(function () {
                        self.selectedUrl(url);
                    });
                };
                podcast.selected = ko.computed(function () {
                    return self.selectedUrl() === url;
                });
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
