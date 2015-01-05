var bus = require('message-bus');

var viewModel = {
    init: function () {
        var self = this;
        var selected = localStorage.getItem('selected-section') || 'Foto';
        this.mainContent = ko.observable(selected.toLowerCase());
        bus.subscribe('main-content', function(item) {
            self.mainContent(item.data.toLowerCase());
        });
        createSections(this);

    }
};

function createSections(self) {
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

    self.sections = sections.map(function(section) {
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
    self.selectedIndex = ko.observable(0);
    self.sections.forEach(function(section, index) {
        if (section.text() === selected) {
            section.selected(true);
            self.selectedIndex(index);
        }
    });
}


module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
