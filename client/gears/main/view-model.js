var bus = require('message-bus');
var request = require('data-request');

var viewModel = {
    init: function () {
        var self = this;
        self.mainContent = ko.observable('');
        bus.subscribe('main-content', function (item) {
            self.mainContent(item.data.toLowerCase());
        });
        createSections(this);

    }
};

function createSections(self, callback) {
    self.sections = ko.observableArray();
    self.selectedIndex = ko.observable(0);
    request.getJson('menu', function (sections) {
        var selected = localStorage.getItem('selected-section');
        sections.forEach(function (section, index) {
            section.selected = ko.observable(false);
            section.header = section.header || false;
            section.id = section.id || section.text.toLowerCase();
            section.select = function () {
                if (!section.header) {
                    self.sections().forEach(function (s) {
                        s.selected(false);
                    });
                    localStorage.setItem('selected-section', section.id);
                    section.selected(true);
                    bus.publish('main-content', section.id);
                    document.querySelector('#sidebar').parentElement.className = 'row row-offcanvas row-offcanvas-left';
                }
            };
            if (selected) {
                if (section.id === selected) {
                    section.select();
                }
            } else if (section.startPage) {
                section.select();
            }
            self.sections.push(section);
        });
    });

}


module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
