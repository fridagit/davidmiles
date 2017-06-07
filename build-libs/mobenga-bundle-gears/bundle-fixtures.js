var gulp = require('gulp');
var concat = require('gulp-concat');

var wrap = require('mobenga-wrap');

module.exports = function bundleFixtures(folder, json) {

	var gearName = json.name;

	return gulp.src(folder + '/test/fixtures/*.js')
		.pipe(wrap({module: true, base: gearName + '/test/fixtures'}))
		.pipe(concat(gearName + '.fixtures-v' + json.version + '.js'));

};