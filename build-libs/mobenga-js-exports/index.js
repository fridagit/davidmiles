var streamify = require('mobenga-streamify');

function jsexports() {
	return streamify(pushdone(function (file, _, done) {
		var body = file.contents.toString();
		file.contents = new Buffer("module.exports = " + JSON.stringify(body) + ";");
	}));
}

function pushdone(fn) {
	return function (file, _, done) {
		fn.apply(this, arguments);
		this.push(file);
		done();
	};
}

module.exports = jsexports;
