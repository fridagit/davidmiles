var request = require('utils/request');

function deserialize(response) {
	return JSON.parse(response.text);
}

function groupData(json) {

	return json.reduce(function (groups, sample) {
		if (!groups[sample.eventkey]) {
			groups[sample.eventkey] = [];
		}
		var group = groups[sample.eventkey];

		group.push(sample);
		return groups;
	}, {});
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
				data = groupData(json);
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