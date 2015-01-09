var request = require('data-request');

module.exports = {
    init: function () {
        this.references = ko.observableArray();
        request.getJson('referenser', function(references) {
            references.forEach(function(reference) {
               reference.text = '”' + reference.text + '”';
            });
            this.references(references);
        }.bind(this));
    }
};