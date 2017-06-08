var File = require('vinyl');
var folderStreams = require('../index');
var expect = require('chai').expect;
var path = require('path');

describe('folder-streams', function () {

	it('should run stream generator for each folder', function (done) {

		var folders = [];
		var stream = folderStreams(['test/fixtures/folders'], null, function (folder) {
			folders.push(folder);
			var stream = require('stream').PassThrough({ objectMode: true });
			stream.end();
			return stream;
		});

		stream.on('end', function () {
			expect(folders).to.include('test/fixtures/folders/a');
			expect(folders).to.include('test/fixtures/folders/b');

			done();
		});

	});

	it('should ignore folders through filter', function (done) {

		function shouldInclude(folder) {
			return folder.indexOf('folders/a') === -1;
		}

		var folders = [];
		var stream = folderStreams(['test/fixtures/folders'], [shouldInclude], function (folder) {

			folders.push(folder);
			var stream = require('stream').PassThrough({ objectMode: true });
			stream.end();
			return stream;
		});

		stream.on('end', function () {

			expect(folders).to.not.include('test/fixtures/folders/a');
			expect(folders).to.include('test/fixtures/folders/b');

			done();
		});

	});

	it('should return stream for each folder', function (done) {

		var fileContent = {};

		var stream = folderStreams(['test/fixtures/folders'], null, function (folder) {

			var stream = require('stream').PassThrough({ objectMode: true });
			setTimeout(function () {
				var fakeFile = new File({
					path: folder,
					contents: new Buffer(folder)
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

			expect(fileContent['a']).to.equal('test/fixtures/folders/a');
			expect(fileContent['b']).to.equal('test/fixtures/folders/b');

			done();
		});

	});

	it('should ignore empty folders', function (done) {

		var stream = folderStreams(['test/fixtures/empty']);

		stream.on('data', function () {
		});

		// testing that stream is ended even though no folders were found
		stream.on('end', function () {
			expect();
			done();
		});

	});

});
