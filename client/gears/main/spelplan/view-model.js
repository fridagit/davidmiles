var request = require('data-request');

module.exports = {
    init: function () {
        var self = this;
        this.upcoming = ko.observableArray();
        this.history = ko.observableArray();
        request.getJson('spelplan', function (gigs) {
            gigs.forEach(function (gig) {
                var gigDate = new Date(gig.date);
                var now = new Date();
                now.setHours(0, 0, 0, 0);
                if (now <= gigDate) {
                    self.upcoming.push(gig);
                } else {
                    self.history.push(gig);
                }
            });
        });

    }
};

function dateString(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getyFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    return day + "-" + month + "-" + year;
}