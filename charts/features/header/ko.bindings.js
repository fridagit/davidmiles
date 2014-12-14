var router = require('router');

ko.bindingHandlers.navigate = {

	init: function (element, valueAccessor) {
		var value = valueAccessor();
		ko.utils.registerEventHandler(element, 'click', function (e) {
			router.navigate(value);
		}, false);
	}
};