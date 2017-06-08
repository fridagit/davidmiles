var streamify = require('mobenga-streamify');
var path = require('path');

module.exports = function (opt) {
	opt = opt || { module: true };

	return streamify(function (file, _, done) {
		this.push(opt.module ? mod(file, opt.base || '') : anon(file));
		done();
	});
};

function mod(file, base) {
	var header = "require.register('{{name}}', function(require, exports, module) {";
	var footer = "\n});";
	return wrap(file, base, header, footer);
}

function anon(file) {
	var header = "(function() {\n";
	var footer = "\n})();";
	return wrap(file, null, header, footer);
}

function wrap(file, base, header, footer) {

	if (file.isStream()) {
		throw new Error('Stream mode is not supported');
	} else if (file.isBuffer()) {
		var body = file.contents.toString();
		var name = file.relative.replace(path.extname(file.relative), '')
			// window machines
			.replace(/\\/g, '/');

		if (base) {
			name = base + '/' + name;
		}

		file.contents = new Buffer(header.replace('{{name}}', name) + body + footer);
	}
	return file;
}
