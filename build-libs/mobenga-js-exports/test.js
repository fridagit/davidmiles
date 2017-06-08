var expect = require('chai').expect;
var File = require('vinyl');

var jsExports = require('./index');

describe('js-exports', function () {
	it('should wrap with module exports', function () {

		var fakeFile = new File({
			path: "/test/file.js",
			contents: new Buffer('{"foo":"bar"}')

		});

		var stream = jsExports();
		stream.once('data', function (file) {
			var content = file.contents.toString('utf8');
			expect(content).to.equal('module.exports = \'"{\\"foo\\":\\"bar\\"}\"\';')
		});
		stream.write(fakeFile);
	});
});
