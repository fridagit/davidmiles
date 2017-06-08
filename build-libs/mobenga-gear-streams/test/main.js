var File = require('vinyl');
var gearStreams = require('../index');
var expect = require('chai').expect;

var path = require('path');

describe('bundle-gear', function () {

	it('should ignore gears which have no feature.json', function (done) {
		var folders = [];

		var stream = gearStreams(['test/fixtures/gears'], function (folder, pkg) {
			folders.push(folder);

			var stream = require('stream').PassThrough({ objectMode: true });
			setTimeout(function () {
				stream.end();
			}, 0);
			return  stream;
		});

		stream.on('end', function () {
			expect(folders).to.not.include('test/fixtures/gears/ignore');
			done();
		})


	});

	it('should run stream generator for gear', function (done) {

		// this works because only one valid gears is available in fixtures
		gearStreams(['test/fixtures/gears'], function (folder, pkg) {

			expect(folder).to.equal('test/fixtures/gears/foo');
			expect(pkg).to.deep.equal({
				"name": "foo",
				"version": "0.1.0"
			});
			done();

			return require('stream').PassThrough({ objectMode: true });
		});


	});

	it('should return generated gear stream', function (done) {

		var fileContent = {};

		var stream = gearStreams(['test/fixtures/gears'], function (folder, pkg) {

			var stream = require('stream').PassThrough({ objectMode: true });
			setTimeout(function () {
				var fakeFile = new File({
					path: 'foo_bar.js',
					contents: new Buffer('foo:bar')
				});
				stream.write(fakeFile);
				stream.end();
			}, 0);

			return  stream;
		});

		stream.on('data', function (file) {
			var fileName = path.basename(file.path);
			fileContent[fileName] = file.contents.toString('utf8');
		});

		stream.on('end', function () {
			expect(fileContent['foo_bar.js']).to.equal('foo:bar');
			done();
		});

	});

	it('should provide warning and ignore gear with broken feature.json', function (done) {

			var paths = [];

			var stream = gearStreams(['test/fixtures/gears'], function (folder, pkg) {

				var stream = require('stream').PassThrough({ objectMode: true });
				setTimeout(function () {
					var fakeFile = new File({
						path: folder+'/min.js',
						contents: new Buffer('testing')
					});
					stream.write(fakeFile);
					stream.end();
				}, 0);

				return  stream;
			});

			stream.on('data', function (file) {
				 paths.push(file.path);

			});

			stream.on('end', function () {
				expect(paths).to.not.contain('test/fixtures/gears/broken/min.js');
				done();
			});

		});

});
