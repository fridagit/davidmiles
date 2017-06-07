var bundleGears = require('../index');
var expect = require('chai').expect;

var path = require('path');

describe('bundle-gear', function () {

	describe('bundling source', function () {

		it('should add gear bundles to stream', function (done) {
			var fileNames = [];

			var stream = bundleGears.source(['test/fixtures/gears']);

			stream.on('data', function (file) {
				fileNames.push(path.basename(file.path));
			});

			stream.on('end', function () {
				expect(fileNames).to.contain('foo-v0.1.0.js');
				expect(fileNames).to.contain('hello-v0.1.0.js');
				done();
			});
		});

		it('should register gears to cogwheels', function (done) {
			var fileContent = {};

			var stream = bundleGears.source(['test/fixtures/gears']);

			stream.on('data', function (file) {
				var fileName = path.basename(file.path);
				fileContent[fileName] = file.contents.toString('utf8');
			});

			stream.on('end', function () {
				expect(fileContent['foo-v0.1.0.js']).to.contain('window.cogwheels.addFeature({name: "foo", version: "0.1.0"});');
				expect(fileContent['hello-v0.1.0.js']).to.contain('window.cogwheels.addFeature({name: "hello", version: "0.1.0"});');

				done();
			});
		});

		it('should ignore gears which have no feature.json', function (done) {
			var fileNames = [];

			var stream = bundleGears.source(['test/fixtures/gears']);

			stream.on('data', function (file) {
				fileNames.push(path.basename(file.path));
			});

			stream.on('end', function () {
				expect(fileNames).to.not.contain('ignore');

				done();
			});
		});

		it('should wrap html', function (done) {
			var fileContent = {};

			var stream = bundleGears.source(['test/fixtures/gears']);

			stream.on('data', function (file) {
				var fileName = path.basename(file.path);
				fileContent[fileName] = file.contents.toString('utf8');
			});

			stream.on('end', function () {
				expect(fileContent['hello-v0.1.0.js']).to.contain("require.register(\'hello/html\'");
				expect(fileContent['hello-v0.1.0.js']).to.contain('<div id=\\"hello-div\\"></div>');
				done();
			});
		});

		it('should be possible to send in configuration for htmlMin', function (done) {
			var fileContent = {};

			var stream = bundleGears.source(['test/fixtures/gears'], {htmlMin: {
				removeComments: true	// removing comments (default is to keep)
			}});

			stream.on('data', function (file) {
				var fileName = path.basename(file.path);
				fileContent[fileName] = file.contents.toString('utf8');
			});

			stream.on('end', function () {
				expect(fileContent['hello-v0.1.0.js']).to.not.contain("<!-- html-comment -->");

				done();
			});
		});

		it('should wrap libraries with anonymous closure', function (done) {
			var fileContent = {};

			var stream = bundleGears.source(['test/fixtures/gears']);

			stream.on('data', function (file) {
				var fileName = path.basename(file.path);
				fileContent[fileName] = file.contents.toString('utf8');
			});

			stream.on('end', function () {
				expect(fileContent['foo-v0.1.0.js']).to.contain('var string = "this is a neat library";');
				done();
			});
		});

		it('should not include libraries when config.ignoreLibs is true', function(done){

			var fileContent = {};

			var stream = bundleGears.source(['test/fixtures/gears'], {ignoreLibs: true});

			stream.on('data', function (file) {
				var fileName = path.basename(file.path);
				fileContent[fileName] = file.contents.toString('utf8');
			});

			stream.on('end', function () {
				expect(fileContent['foo-v0.1.0.js']).to.not.contain('var string = "this is a neat library";');
				done();
			});
		});

		it('should ignore test folder in bundle', function (done) {
			var fileContent = {};

			var stream = bundleGears.source(['test/fixtures/gears']);

			stream.on('data', function (file) {
				var fileName = path.basename(file.path);
				fileContent[fileName] = file.contents.toString('utf8');
			});

			stream.on('end', function () {
				expect(fileContent['foo-v0.1.0.js']).to.not.contain("require.register('foo/test/fixtures/sayHello");
				expect(fileContent['foo-v0.1.0.js']).to.not.contain("require.register('foo/test/specs/fooTest");
				done();
			});
		});

		it('should filter gears based on configuration', function (done) {
			var fileNames = [];

			var stream = bundleGears.source(['test/fixtures/gears'], { filters: [isFooGear] });

			function isFooGear(dir) {
				return (path.basename(dir) === 'foo');
			}

			stream.on('data', function (file) {
				fileNames.push(path.basename(file.path));
			});

			stream.on('end', function () {
				expect(fileNames).to.contain('foo-v0.1.0.js');
				expect(fileNames.length).to.equal(1);
				done();
			});
		});

	});

	describe('bundling fixtures', function () {
		it('should include fixtures in bundle', function (done) {

			var fileContent = {};
			var stream = bundleGears.fixtures(['test/fixtures/gears']);

			stream.on('data', function (file) {
				var fileName = path.basename(file.path);
				fileContent[fileName] = file.contents.toString('utf8');
			});

			stream.on('end', function () {
				expect(fileContent['foo.fixtures-v0.1.0.js']).to.contain("require.register('foo/test/fixtures/sayHello");
				done();
			});
		});
	});

	/*
	 * These tests are only legacy for the backwards compatibility of bundle specs
	 * bundle specs functionality is deprecated since version 1.2.0
	 */
	describe('bundling specs', function () {

		it('should load runners in bundle', function (done) {
			var fileContent = {};
			var stream = bundleGears.specs(['test/fixtures/gears']);

			stream.on('data', function (file) {
				var fileName = path.basename(file.path);
				fileContent[fileName] = file.contents.toString('utf8');
			});

			stream.on('end', function () {
				expect(fileContent['foo-legacy.specs-v0.1.0.js']).to.contain("require.register('foo-legacy/specs/fooTest'");
				done();
			});
		});

		it('should include fixtures bundle', function (done) {
			var fileContent = {};
			var stream = bundleGears.specs(['test/fixtures/gears']);

			stream.on('data', function (file) {
				var fileName = path.basename(file.path);
				fileContent[fileName] = file.contents.toString('utf8');
			});

			stream.on('end', function () {
				expect(fileContent['foo-legacy.specs-v0.1.0.js']).to.contain("require.register('foo-legacy/specs/fixtures/sayHello");
				done();
			});
		});
	});

});
