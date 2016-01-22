var request = require('utils/request');
var login = require('login');

var viewModel = {
    init: function (params) {
        this.textToEdit = params.textToEdit;
        this.fileName = params.fileName;
        this.isLoggedIn = login.isLoggedIn;
        this.editMode = params.editMode;
        this.css = ko.computed(function () {
            return this.editMode() ? 'editBox' : '';
        }, this);
    },

    edit: function () {
        if (login.isLoggedIn()) {
            this.editMode(true);
        }
    },

    cancel: function () {
        this.editMode(false);
    },

    save: function () {
        request.post("/admin/save.php?name=" + this.fileName + "&password=" + login.getPassword(), this.textToEdit(), function (res) {
            location.reload();
        });
    }
};


module.exports.create = function (params) {
    var vm = Object.create(viewModel);
    vm.init(params);
    return vm;
};
