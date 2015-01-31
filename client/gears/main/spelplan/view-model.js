var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        this.first = ko.observable();
        this.upcoming = ko.observableArray();
        this.history = ko.observableArray();
        this.loading = ko.observable(true);
        request.getJson('spelplan', function (gigs) {
            self.loading(false);
            gigs.forEach(function (gig) {
                var gigDate = new Date(gig.date);
                var now = new Date();
                now.setHours(0, 0, 0, 0);
                gigDate.setHours(0, 0, 0, 0);
                if (now <= gigDate) {
                    if (!self.first()) {
                        var diff = dayDiff(now, gigDate);
                        if (diff === 0) {
                            gig.distance = 'är idag!';
                        } else {
                            gig.distance = 'är om ' + diff + ' dagar';
                        }
                        self.first(gig);
                    } else {
                        self.upcoming.push(gig);
                    }
                } else {
                    self.history.push(gig);
                }
            });
        });

    }
};

function dayDiff(first, second) {
    return parseInt((second - first) / (1000 * 60 * 60 * 24));
}