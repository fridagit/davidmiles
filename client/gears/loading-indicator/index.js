exports.init = function () {
	ko.components.register('loading', component);
};

var component = {
	template: '<div data-bind="if: visible" style="text-align: center"><img src="img/loading.gif"></div>'
};