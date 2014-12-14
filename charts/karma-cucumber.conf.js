// Karma cucumber configuration

module.exports = function (config) {

	config.set({

		// base path, that will be used to resolve files and exclude
		basePath: '',

		// frameworks to use
		frameworks: ['chai', 'cucumber'],

		plugins: [
			'karma-phantomjs-launcher',
			'karma-chrome-launcher',
			'karma-chai',
			require('cogwheels-tools/karma/cucumber')
		],

		// list of files / patterns to load in the browser
		//files: [],

		// list of files to exclude
		//exclude: [],

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: ['cucumber'],

		preprocessors: {
			'features/*/cucumber/*.feature': ['cucumber-feature'],
			'features/*/cucumber/step_definitions/*.js': ['cucumber-steps']
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false
	});

};
