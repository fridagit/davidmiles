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
            var now = new Date();
            now.setHours(0, 0, 0, 0);
            var upcoming = [];
            gigs.split('\n').forEach(function (line) {
                var gig = {};
                gig.date = parseDate(line);
                if (gig.date) {
                    gig.place = line.replace(gig.date, '');
                    gig.dateObject = new Date(gig.date);
                    gig.dateObject.setHours(0, 0, 0, 0);
                    if (now <= gig.dateObject) {
                        upcoming.push(gig);
                    } else {
                        self.history.unshift(gig);
                    }
                }
            });
            upcoming.sort(function(a,b) {
                return a.dateObject - b.dateObject;
            });
            var first = upcoming[0];
            var diff = dayDiff(now, first.dateObject);
            if (diff === 0) {
                first.distance = 'är idag!';
            } else {
                first.distance = 'är om ' + diff + ' dagar';
            }
            self.first(first);
            self.upcoming(upcoming);
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