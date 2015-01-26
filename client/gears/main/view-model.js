var bus = require('message-bus');
var request = require('data-request');

var viewModel = {
    init: function () {
        var self = this;
        self.mainContent = ko.observable('');
        self.sections = ko.observableArray();
        bus.subscribe('main-content', function (item) {
            var section = item.data.toLowerCase();
            self.mainContent(section);
            localStorage.setItem('selected-section', section);
        });
    },
    createSections: function () {
        var self = this;
        request.getJson('menu', function (sections) {
            var selected = localStorage.getItem('selected-section');
            sections.forEach(function (section, index) {
                section.selected = ko.observable(false);
                section.initPage = ko.observable(false);
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
                        section.initPage(true);
                    }
                } else if (section.startPage) {
                    section.select();
                    section.initPage(true);
                }
                self.sections.push(section);
            });
        });

    }
};


module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
