var request = require('data-request');
var router = require('router');

module.exports = {
    init: function () {
        var self = this;
        this.first = ko.observable();
        this.upcoming = ko.observableArray();
        this.history = ko.observableArray();
        this.loading = ko.observable(true);
        this.editMode = ko.observable(false);
        this.gigs = ko.observable();
        request.getTxt('spelplan', function (gigs) {
            self.loading(false);
            self.gigs(gigs);
            gigs.split('\n').forEach(function (line) {
                var gig = {};
                gig.date = parseDate(line);
                if (gig.date) {
                    gig.place = line.replace(gig.date, '');
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
                        self.history.unshift(gig);
                    }
                }
            });
        });

    }
};

function dayDiff(first, second) {
    return parseInt((second - first) / (1000 * 60 * 60 * 24));
}

function parseDate(line) {
    var matches = line.match(/\d\d\d\d-\d\d-\d\d( \d\d?:\d\d)?/);
    if (matches && matches.length) {
        var gig = {};
        return matches[0];
    }
    return undefined;
}