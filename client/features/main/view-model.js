var bus = require('message-bus');
var request = require('utils/request');

var viewModel = {
    init: function () {
        var self = this;
        var selected = localStorage.getItem('selected-section') || 'Foto';
        this.mainContent = ko.observable(selected.toLowerCase());
        bus.subscribe('main-content', function (item) {
            self.mainContent(item.data.toLowerCase());
        });
        createSections(this);

    }
};

function createSections(self) {
    self.sections = ko.observableArray();
    self.selectedIndex = ko.observable(0);
    request.get('/json/menu.json', function (res) {
        if (res.status === 200) {
            var sections = res.body;
            var selected = localStorage.getItem('selected-section') || 'Foto';
            sections.forEach(function (section, index) {
                section.selected = ko.observable(false);
                section.header = section.header || false;
                section.select = function (current) {
                    if (!section.header) {
                        self.sections().forEach(function (s) {
                            s.selected(false);
                        });
                        localStorage.setItem('selected-section', current.text);
                        current.selected(true);
                        bus.publish('main-content', current.text.toLowerCase());
                    }
                };
                if (section.text === selected) {
                    section.selected(true);
                    self.selectedIndex(index);
                }
                self.sections.push(section);
            });
        }
    });

}


module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
