var bus = require('message-bus');
var request = require('data-request');
var router = require('router');
var login = require('login');

var viewModel = {
    init: function () {
        var self = this;
        self.mainContent = ko.observable('');
        self.sections = ko.observableArray();
        self.loggedIn = login.isLoggedIn();
        bus.subscribe('main-content', function (item) {
            var section = item.data.toLowerCase();
            self.mainContent(section.replace('-','/'));
        });
    },
    createSections: function (selected) {
        var self = this;
        request.getJson('menu', function (sections) {
            sections.forEach(function (section, index) {
                if (!section.hidden) {
                    section.initPage = ko.observable(false);
                section.header = section.header || false;
                section.id = section.id || section.text.toLowerCase();
                    if (section.category) {
                        section.id = section.category + '-' + section.id;
                    }
                section.selected = ko.computed(function () {
                    return section.id === self.mainContent();
                });
                section.select = function () {
                    if (!section.header) {
                        router.navigate('/#' + section.id);
                        document.querySelector('#sidebar').parentElement.className = 'row row-offcanvas row-offcanvas-left';
                    }
                };
                if (!selected) {
                    if (section.startPage) {
                        section.select();
                        section.initPage(true);
                    }
                }
                self.sections.push(section);
                }
            });
            if (selected)  {
                bus.publish('main-content', selected);
            }
        });
    }
};


module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
