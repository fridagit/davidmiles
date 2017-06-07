var once = require('once');
var File = require('vinyl');
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");

var checkConflict = require('./index');

var expect = chai.expect;
chai.use(sinonChai);

describe('check conflict', function () {

	var spy;

	beforeEach(function () {
		spy = sinon.spy(process.stdout, 'write');
	});

	afterEach(function () {
		spy.restore();
	});

	[
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
	].forEach(function (keyword) {

			// Because checkConflict exits the process on conflict the tests will terminate after first valid assertion,
			// improvement could spawn child processes.
			it('should provide error and exit on conflict for "' + keyword + '"', function (done) {

				var path = "/test/file.json";
				var contents = JSON.stringify({name: keyword});

				var stream = checkConflict();

				var fakeFile = new File({
					path: path,
					contents: new Buffer(contents)
				});

				var assert = once(function () {
					expect(spy).to.have.been.calledWith('/test/file.json: is conflicting with cogwheels');
					done();
				});

				// exit is triggered if conflict is found
				process.once('exit', assert);

				// if conflict is not found exit will not be triggered, listen to data on stream instead
				stream.once('data', assert);

				stream.write(fakeFile);
			});
		});

});


