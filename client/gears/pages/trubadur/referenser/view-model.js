var request = require('data-request');
var utils = require('dm-utils');

module.exports = {
    init: function () {
        this.references = ko.observableArray();
        var self = this;
        self.referencesString = ko.observable('');
        request.getTxt('referenser', function (referencesString) {
            self.referencesString(referencesString);
            var items = utils.parseTextToItems(referencesString);
            items.forEach(function(item) {
                item.text = '”' + item.text + '”';
            });
            self.references(items);
        }.bind(this));
    }
};