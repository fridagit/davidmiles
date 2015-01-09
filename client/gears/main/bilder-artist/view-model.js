var request = require('data-request');

module.exports = {
    init: function () {
        this.images = ko.observableArray();
        var self = this;
        this.loopImg = ko.observableArray();
        this.afterAdd = function (elem) {
            if (elem.nodeType === 1) {
                $(elem).hide().fadeIn(); // jshint ignore:line
                setTimeout(function () {
                    self.loopImg.pop();
                }, 3000);
            }
        };
        this.beforeRemove = function (elem) {
            if (elem.nodeType === 1) {
                $(elem).fadeOut(function () { // jshint ignore:line
                    $(elem).remove(); // jshint ignore:line
                    self.loopIndex = self.loopIndex === self.images().length - 1 ? 0 : self.loopIndex + 1;
                    self.loopImg.push(self.images()[self.loopIndex]);
                });
            }
        };

        request.getJson('bilder-artist', function (images) {
            self.images(images);
            self.loopIndex = 0;
            self.loopImg.push(images[self.loopIndex]);
        });

    }
};
