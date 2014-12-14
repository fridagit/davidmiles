var router = require('router');
var webStorage = require('web-storage');
var bus = require('message-bus');

var viewModel = {
    init: function () {
        var self = this;
        var sections = [
            {
                text: 'Foto',
                selected: true
            },
            {
                text: 'Album'
            },
            {
                text: 'Video'
            }
        ];

        this.sections = sections.map(function(section) {
            return {
                text: ko.observable(section.text),
                selected: ko.observable(false),
                select: function(current) {
                    self.sections.forEach(function(s){
                        s.selected(false);
                    });
                    localStorage.setItem('selected-section', current.text());
                    current.selected(true);
                    bus.publish('main-content', current.text().toLowerCase());
                }
            };
        });
        var selected = localStorage.getItem('selected-section') || 'Foto';
        this.selectedIndex = ko.observable(0);
        this.sections.forEach(function(section, index) {
            if (section.text() === selected) {
                section.selected(true);
                self.selectedIndex(index);
            }
        });


    }
};

module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
