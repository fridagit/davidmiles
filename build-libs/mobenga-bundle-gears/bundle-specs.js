var gulp = require('gulp');
var concat = require('gulp-concat');
var footer = require('gulp-footer');
var path = require('path');
var glob = require('glob');

var wrap = require('mobenga-wrap');

/*
 * @deprecated
 * This function is deprecated since version 1.2.0 since Sonar analysis requires each test "describe" function to be in
 * its own file. Also the test file name needs to be the same as the "describe" function name + .js
 */
module.exports = function bundleSpecs(folder, json) {

	var gearName = json.name;

	// grab module names of all spec runners
	var specModules = glob.sync('specs/**/*.spec.js', {cwd: folder}).map(function (name) {
		return gearName + '/' + name.replace(path.extname(name), '');
	});

	return gulp.src(folder + '/specs/**/*.js')
		.pipe(wrap({module: true, base: gearName + '/specs'}))
		.pipe(concat(gearName + '.specs-v' + json.version + '.js'))
		// append loading of spec runners
		.pipe(footer('\n' + specModules.map(function (name) {
			return 'require("' + name + '");';
		}).join('\n')));

};