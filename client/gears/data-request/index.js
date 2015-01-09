var request = require('utils/request');

exports.getJson = function (jsonName, callback) {
	request.get('/json/' + jsonName + '.json', function (res) {
		if (res.status === 200) {
			var json = JSON.parse(res.text);
			callback(json);
		}
	});
};

exports.get = request.get;