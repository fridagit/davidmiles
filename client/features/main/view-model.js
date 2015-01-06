var bus = require('message-bus');

var viewModel = {
    init: function () {
        var self = this;
        var selectedSubSection = localStorage.getItem('selected-section') || 'Foto';
        this.mainContent = ko.observable(selectedSubSection.toLowerCase());
        bus.subscribe('main-content', function (item) {
            self.mainContent(item.data.toLowerCase());
        });
        createSections(this);

    }
};

function createSections(self) {
    var sections = [
        {
            text: 'Trubaduren',
            icon: 'av:artist',
            subSections: ['Erbjuder', 'Kontakt']
        },
        {
            text: 'Artisten',
            icon: 'av:queue-music',
            subSections: ['Foto', 'Discografi', 'Video']
        }
    ];

    var selectedSection = localStorage.getItem('selected-section') || 'Låtskrivaren';
    var selectedSubSection = localStorage.getItem('selected-section') || 'Foto';
    self.selectedSectionIndex = ko.observable(0);
    self.selectedSubSectionIndex = ko.observable(0);

    sections.forEach(function (section, index) {
        section.selected = ko.observable(false);
        if (section.text === selectedSection) {
            section.selected(true);
            self.selectedSectionIndex(index);
        }
        var subSections = [];
        section.subSections.forEach(function (text, subIndex) {
            var subSection = {
                text: text,
                selected: ko.observable(false),
                select: function (current) {
                    subSections.forEach(function (s) {
                        s.selected(false);
                    });
                    localStorage.setItem('selected-section', current.text);
                    current.selected(true);
                    bus.publish('main-content', current.text.toLowerCase());
                }
            };
            if (subSection.text === selectedSubSection) {
                subSection.selected(true);
                self.selectedSubSectionIndex(subIndex);
            }
            subSections.push(subSection);
        });
        section.subSections = subSections;
    });
    self.sections = sections;
}


module.exports.create = function () {
    var vm = Object.create(viewModel);
    vm.init();
    return vm;
};
