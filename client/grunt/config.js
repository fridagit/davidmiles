module.exports = function (grunt) {

	var config = {};

	// Package details (important)
	config.pkg = grunt.file.readJSON('package.json');

	// JSHint settings
	config.jshint = {
		options: {
			ignores: ['features/**/lib/*.js'],
			jshintrc: '.jshintrc' // Grab options from JSHint file
		},
		grunt: ['Gruntfile.js', 'grunt/**/*.js'],
		features: ['features/**/*.js']
	};

	// Build product (project)
	config['build-product'] = {
		options: {
			sourceDir: 'web',
			targetDir: 'builds/web'
		},
		development: {
			name: 'development',
			features: []

		}
	};

	// Clean (to make folders empty)
	config.clean = {
		web: ['builds/web'],
		reports: ['builds/reports']
	};

	// Watch (for running tasks when files change)
	config.watch = {
		options: {
			spawn: false,
            livereload: true
		},
		all: {
			files: ['web/**', 'features/**'],
			tasks: ['build']
		}
	};

	return config;

};
