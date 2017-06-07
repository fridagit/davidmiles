var gulp = require('gulp');
var es = require('event-stream');
var path = require('path');

var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var footer = require('gulp-footer');
var gulpIf = require('gulp-if');
var sourceMaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');

var wrap = require('mobenga-wrap');
var jsExports = require('mobenga-js-exports');

function changeDirname(name) {
	return function (filePath) {
		var dirname = filePath.dirname.replace(/\\/g, '/');
		var index = dirname.indexOf('/');
		if (index !== -1) {
			filePath.dirname = name + dirname.substring(index, dirname.length);
		} else {
			filePath.dirname = name;
		}
	}
}

function libraries(folder) {

	var sources = path.join(folder, 'lib', '**', '*.js');
	var base = path.normalize(folder + '/..');

	return gulp.src(sources, {base: base})
		.pipe(wrap({module: false}));
}

function scripts(folder, json, config) {

	var shouldSourceMap = config && config.sourceMaps;

	var sources = toGlob(folder, 'js');
	var base = path.normalize(folder + '/..');

	return gulp.src(sources, {base: base})
		.pipe(rename(changeDirname(json.name)))	// name of gear is provided via feature.json
		.pipe(gulpIf(shouldSourceMap, sourceMaps.init()))
		.pipe(wrap({module: true}));
}

function html(folder, json, config) {
	var sources = toGlob(folder, 'html');
	var base = path.normalize(folder + '/..');
	var shouldSourceMap = config && config.sourceMaps;

	var htmlMinConfig = config && config.htmlMin || {
		collapseWhitespace: true,
		removeComments: false
	};

	return gulp.src(sources, {base: base})
		.pipe(rename(changeDirname(json.name)))	// name of gear is provided via feature.json
		.pipe(htmlmin(htmlMinConfig))
		.pipe(gulpIf(shouldSourceMap, sourceMaps.init()))
		.pipe(jsExports())
		.pipe(wrap({module: true}));
}

function toGlob(name, type) {
	return [
		path.join(name, '**', '*.' + type),
			'!' + path.join(name, 'test', '**'),	// excluding test folder (containing specs and fixtures)
			'!' + path.join(name, 'specs', '**'),	// excluding specs (for backwards compatibility only)
			'!' + path.join(name, 'lib', '**')	// excluding lib folder
	];
}

module.exports = function bundleSource(config) {

	return function (folder, json) {

		var subtasks = [
			scripts(folder, json, config),
			html(folder, json, config)
		];
		 if(!config.ignoreLibs) {
		 	subtasks.push(libraries(folder, config));
		 }

		var mainAlias = json.main ? 'require.alias("<%= name %>", "<%= name %>/<%= main %>");\n' : '';
		var registerFeature = 'window.cogwheels.addFeature({name: "<%= name %>", version: "<%= version %>"' + (json.prio ? ', prio: <%= prio %>' : '') + '});';
		var footerTpl = '\n'+mainAlias+registerFeature;

		return es.concat.apply(null, subtasks)
			.pipe(concat(json.name + '-v' + json.version + '.js'))
			.pipe(footer(footerTpl, json));
	}
};
