var request = require('data-request');

var viewModel = {
    init: function (params) {
        var self = this;
        this.images = ko.observableArray();
        this.loopImg = ko.observableArray();
        this.loopText = ko.observable('');
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
                    setNextImage();
                });
            }
        };

        request.getJson(params.jsonName, function (images) {
            self.images(images);
            self.loopIndex = 0;
            setNextImage();
        });

        function setNextImage() {
            var nextImage = self.images()[self.loopIndex];
            self.loopImg.push(nextImage);
            self.loopText(nextImage.text);
        }

    }
};


module.exports.create = function (params) {
    var vm = Object.create(viewModel);
    vm.init(params);
    return vm;
};
