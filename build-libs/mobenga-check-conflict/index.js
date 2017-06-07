var streamify = require('mobenga-streamify');

module.exports = function (opt) {


	var reserved = [
		"cogwheels",
		"lifecycle-manager",
		"message-bus",
		"router",
		"web-storage",
		"boot",
		"layout-engine",
		"router",
		"utils",
		"web-storage"
	];

	return streamify(function (file, _, done) {
		var json = JSON.parse(file.contents.toString());
		if (reserved.indexOf(json.name) !== -1) {
			process.stdout.write(file.path + ': is conflicting with cogwheels');
			process.exit(1);
		}
		this.push(file);
		done();
	});
};