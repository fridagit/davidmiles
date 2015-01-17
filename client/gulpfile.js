var gulp = require('gulp');
var runSequence = require('run-sequence');
var stylish = require('jshint-stylish');

var jshint = require('gulp-jshint');
var rimraf = require('gulp-rimraf');
var size = require('gulp-size');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var less = require('gulp-less-sourcemap');
var gulpIf = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');

var bundleGears = require('mobenga-bundle-gears');
var conflict = require('mobenga-check-conflict');
var handlebarsStream = require('mobenga-handlebars-stream');

var pkg = require('./package.json');

var node_env = process.env.NODE_ENV || 'development';

console.log('Running gulp for environment: ' + node_env);

var buildsDir = 'builds/web/' + node_env;

gulp.task('build', function (callback) {
	runSequence('clean',
		'lint',
        'copy-npm-libs',
        'copy-css',
		'bundle',
		['copy', 'less'],
		'template',
		callback);
});


gulp.task('copy-npm-libs', function(callback) {
	var files = ['node_modules/cogwheels/builds/cogwheels-*.js',
		'node_modules/cogwheels/lib/knockout*.js',
		'!node_modules/cogwheels/lib/knockout*min.js',
		'!node_modules/cogwheels/builds/cogwheels-*min.js',
		'node_modules/knockout.mapping/knockout.mapping.js',
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/bootstrap/dist/js/bootstrap.min.js'];

	var destDir = buildsDir + '/npm-libs';

	return gulp.src(files).pipe(gulp.dest(destDir));
});

gulp.task('copy-css', function(callback) {
	var files = ['node_modules/bootstrap/dist/css/bootstrap.min.css'];

	var destDir = buildsDir + '/css';

	return gulp.src(files).pipe(gulp.dest(destDir));
});

gulp.task('bundle', function (callback) {
	runSequence('conflict',
		['gears', 'gears:shared'],
		callback);
});

gulp.task('default', ['build']);

gulp.task('lint', function () {
	return gulp.src('gears/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish, {
			fail: true
		}))
		.pipe(jshint.reporter('fail'));
});

gulp.task('watch', ['build'], function () {

	gulp.watch('web/**', ['build']);
	gulp.watch('gears/**', ['build']);
});

gulp.task('clean', function () {
	return gulp.src(buildsDir, {
		read: false
	}).pipe(rimraf());
});

gulp.task('copy', function () {
	return gulp.src([
		'web/**/*', '!web/**/*.less', '!web/**/*.template.html'
	]).pipe(gulp.dest(buildsDir));

});

gulp.task('conflict', function () {

	return gulp.src(['gears/**/feature.json'])
		.pipe(conflict());
});

gulp.task('less', function () {
	gulp.src(['web/css/main.less', 'web/css/*.less'])
		.pipe(size({title: 'less', 'showFiles': true}))
		.pipe(less())
		.pipe(concat('main.css'))
		.pipe(gulp.dest(buildsDir + '/css'))
});

gulp.task('gears', function () {

	var gearDirs = ['gears'];
	var gearsDest = buildsDir + '/gears';
	var htmlMin = {
		collapseWhitespace: true,
		removeComments: false
	};

	return bundleGears.source(gearDirs, {htmlMin: htmlMin})
		.pipe(size({title: 'js', showFiles: true}))
		.pipe(sourcemaps.init())
			.pipe(concat('gears.js'))
			.pipe(rename({suffix: '-v' + pkg.version}))
			.pipe(gulpIf(node_env !== 'development', uglify()))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest(gearsDest));
});

gulp.task('gears:shared', function () {
	var htmlMin = {
		collapseWhitespace: true,
		removeComments: false
	};

	return bundleGears.source(['node_modules'], {htmlMin: htmlMin})
		.pipe(size({title: 'js', showFiles: true}))
		.pipe(concat('shared-gears.js'))
		.pipe(uglify())
		.pipe(gulp.dest(buildsDir));
});

gulp.task('template', function () {
	var opts = {
		cwd: buildsDir
	};

	var data = {
		libs: { files: ['npm-libs/jquery*.js', 'npm-libs/*.js', '!npm-libs/cogwheels*', 'non-npm-libs'], opts: opts },
		css: { files: ['css/*.css'], opts: opts },
		gears: { files: ['gears/gears-v' + pkg.version + '.js'], opts: opts },
		cogwheels: { files: ['npm-libs/cogwheels-v*.js'], opts: opts }
	};

	return handlebarsStream('web/index.template.html', data)
		.pipe(rename('index.html'))
		.pipe(gulp.dest(buildsDir));
});