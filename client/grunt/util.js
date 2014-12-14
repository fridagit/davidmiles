var grunt = require('grunt');

/**
 * Returns relative path to spec file in feature.
 */
exports.getSpecFile = function (featureName, fileName) {

	return ('features/' + featureName + '/specs/' + fileName + '.spec.js');
};

/**
 * Returns relative path to Cucumber step definition file in feature.
 */
exports.getCucumberStepFile = function (featureName, fileName) {

	return ('features/' + featureName + '/cucumber/step_definitions/' + fileName + '.js');
};

/**
 * Returns relative path to Cucumber feature (Gherkin) file in feature.
 */
exports.getCucumberFeatureFile = function (featureName, fileName) {

	return ('features/' + featureName + '/cucumber/' + fileName + '.feature');
};

/**
 * Returns relative path to Cucumber run file (script that starts Cogwheels).
 */
exports.getCucumberRunFile = function (fileName) {

	return ('cucumber-run/' + fileName + '.js');
};

/**
 * Creates Karma configuration for specs.
 */
exports.karmaSpecs = function (defaultFiles, features, fileName, singleRun) {

	// Defaults
	features = features.length ? features : ['*'];
	fileName = fileName || '*';

	var specFiles = [];

	features.forEach(function (featureName) {

		specFiles.push(exports.getSpecFile(featureName, fileName));
	});

	var options = {
		configFile: 'karma.conf.js',
		files: defaultFiles.concat(specFiles)
	};

	if (singleRun !== undefined) {
		options.singleRun = !!singleRun;
	}

	return { options: options };
};

/**
 * Creates Karma configuration for Cucumber.
 */
exports.karmaCucumber = function (defaultFiles, features, fileName, runFile) {

	// Defaults
	features = features.length ? features : ['*'];
	fileName = fileName || '*';
	runFile = runFile || 'default';

	var featureFiles = [];
	var stepFiles = [];
	var files;

	features.forEach(function (featureName) {

		featureFiles.push(exports.getCucumberFeatureFile(featureName, fileName));
		stepFiles.push(exports.getCucumberStepFile(featureName, fileName));
	});

	files = featureFiles.concat(stepFiles);
	files.push(exports.getCucumberRunFile(runFile));

	var options = {
		configFile: 'karma-cucumber.conf.js',
		files: defaultFiles.concat(files),
		singleRun: true
	};

	return { options: options };
};
