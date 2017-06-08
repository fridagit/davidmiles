var wrap = require('./index');
var es = require('event-stream');
var expect = require('chai').expect;
var File = require('vinyl');


describe('wrap', function () {


	it('should throw not supported if file is in stream mode', function () {


		// create the fake file
		var fakeFile = new File({
			cwd: "/",
			base: "/test/",
			path: "/test/file.js",
			contents: es.readArray(['module.exports = {};'])
		});

		var wrapper = wrap();

		expect(function () {
			wrapper.write(fakeFile);
		}).to.throw('Stream mode is not supported')

	});

	it('should wrap with module definition', function (done) {

		var prepend = "require.register('{{name}}', function(require, exports, module) {";
		var append = "\n});";
		var contents = 'module.exports = {};';

		// create the fake file
		var fakeFile = new File({
			cwd: "/",
			base: "/test/",
			path: "/test/file.js",
			contents: new Buffer(contents)
		});


		// create our wrapper
		var wrapper = wrap();

		// write the fake file to it
		wrapper.write(fakeFile);

		// wait for the file to come back out
		wrapper.once('data', function (file) {
			// make sure it came out the same way it went in
			expect(file.isBuffer());

			// check the contents
			var expected = prepend.replace('{{name}}', 'file') + contents + append;
			var wrappedContent = file.contents.toString('utf8');
			expect(wrappedContent).to.equal(expected);
			done();

		});
	});

	it('should with anonymous definition', function (done) {

		var prepend = "(function() {\n";
		var append = "\n})();";
		var contents = 'return {};';

		// create the fake file
		var fakeFile = new File({
			cwd: "/",
			base: "/test/",
			path: "/test/file.js",
			contents: new Buffer(contents)
		});

		// create our wrapper
		var wrapper = wrap({module: false});

		// write the fake file to it
		wrapper.write(fakeFile);

		// wait for the file to come back out
		wrapper.once('data', function (file) {
			// make sure it came out the same way it went in
			expect(file.isBuffer());

			// check the contents
			var expected = prepend + contents + append;
			var wrappedContent = file.contents.toString('utf8');
			expect(wrappedContent).to.equal(expected);
			done();

		});
	});

});


