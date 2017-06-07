var gearStreams = require('mobenga-gear-streams');

var bundleSource = require('./bundle-source');
var bundleFixtures = require('./bundle-fixtures');
var bundleSpecs = require('./bundle-specs');


exports.source = function (rootDirs, config) {
	config = config || {};
	return gearStreams(rootDirs, bundleSource(config), config.filters || []);
};

exports.fixtures = function (rootDirs, config) {
	config = config || {};
	return gearStreams(rootDirs, bundleFixtures, config.filters || []);
};

exports.specs = function (rootDirs, config) {
	config = config || {};
	return gearStreams(rootDirs, bundleSpecs, config.filters || []);
};
