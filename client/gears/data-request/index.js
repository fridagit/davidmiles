var request = require('utils/request');

exports.getJson = function (jsonName, callback) {
	request.get('/json/' + jsonName + '.json', function (res) {
		if (res.status === 200) {
			var json = JSON.parse(res.text);
			callback(json);
		}
	});
};

exports.getTxt = function (txtName, callback) {
	request.get('/json/' + txtName + '.txt', function (res) {
		if (res.status === 200) {
			callback(res.text);
		}
	});
};

exports.getLyrics = function (textName, callback) {
	request.get('/texter/' + textName, function (res) {
		if (res.status === 200) {
			callback(res.text);
		}
	});
};

exports.get = request.get;