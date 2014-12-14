module.exports = function (grunt) {

	var config = {};

	// Add feature names here
	// If empty all features in features folder will be included
	var features = [];

	// Default files to load when running Karma
	var karmaDefaultFiles = [
		// Inject framework files here
		'web/lib/socket.io-*.js',
		'web/lib/knockout-*.js',
		'web/lib/cogwheels*.js',
		//

		'builds/web/development/js/features-*.js'
	];

	// Default files to exclude when running Karma
	var karmaDefaultExclude = [
		'web/lib/*.min.js',
		'builds/web/development/js/*.min.js'
	];

	// Package details (important)
	config.pkg = grunt.file.readJSON('package.json');

	// JSHint settings
	config.jshint = {
		options: {
			ignores: ['features/**/lib/*.js'],
			jshintrc: '.jshintrc' // Grab options from JSHint file
		},
		grunt: ['Gruntfile.js', 'grunt/**/*.js'],
		features: ['features/**/*.js'],
		cucumber: ['cucumber-run/*.js'],
		karma: ['karma*.js']
	};

	// Build product (project)
	config['build-product'] = {
		options: {
			sourceDir: 'web',
			targetDir: 'builds/web'
		},
		development: {
			name: 'development',
			features: features
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
			tasks: ['build', 'run-specs']
		}
	};

	// Karma test runner
	config.karma = {
		options: {
			files: karmaDefaultFiles,
			exclude: karmaDefaultExclude
		},

		// All features
		develop: karmaSpecsConfig('*', false),
		ci: karmaSpecsConfig('*', true),
		cucumber: karmaCucumberConfig('*', 'all'),

		// Calculator sample feature
		'calculator-sample-specs': karmaSpecsConfig('calculator-sample', true),
		'calculator-sample-cucumber': karmaCucumberConfig('calculator-sample')
	};

	/**
	 * Returns Karma configuration for specs.
	 */
	function karmaSpecsConfig(featureName, singleRun) {

		var specsDir = 'features/' + featureName + '/specs';

		var options = {
			configFile: 'karma.conf.js',
			files: karmaDefaultFiles.concat([
				specsDir + '/**/*.spec.js'
			])
		};

		if (singleRun !== undefined) {
			options.singleRun = !!singleRun;
		}

		return { options: options };
	}

	/**
	 * Returns Karma configuration for Cucumber.
	 */
	function karmaCucumberConfig(featureName, runFile) {

		var cucumberDir = 'features/' + featureName + '/cucumber';

		var options = {
			configFile: 'karma-cucumber.conf.js',
			files: karmaDefaultFiles.concat([
				cucumberDir + '/*.feature',
				cucumberDir + '/step_definitions/*.js',
				'cucumber-run/' + (runFile || featureName) + '.js'
			]),
			singleRun: true
		};

		return { options: options };
	}

	return config;

};
