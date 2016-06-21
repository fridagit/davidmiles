var request = require('utils/request');

exports.getJson = function (jsonName, callback) {
	request.get('/json/' + jsonName + '.json?_=' + new Date().getTime(), function (res) {
		if (res.status === 200) {
			var json = JSON.parse(res.text);
			callback(json);
		}
	});
};

exports.getTxt = function (txtName, callback) {
	request.get('/txt/' + txtName + '.txt?_=' + new Date().getTime(), function (res) {
		if (res.status === 200) {
			callback(res.text);
		}
	});
};

exports.get = request.get;