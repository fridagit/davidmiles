var request = require('utils/request');

function deserialize(response) {
	return JSON.parse(response.text);
}

var prototype = {
	end: function (callback) {
		request.post('/data', this.settings, function (response) {

			var err;
			var data;
			var json = deserialize(response);

			if (!Array.isArray(json)) {
				err = new Error('data was not an array!!!!');
			} else {
				data = json;
			}

			callback(err, data);

		}.bind(this));
	}

};

exports.get = function (settings) {
	var req = Object.create(prototype);
	req.settings = settings;
	return req;
};