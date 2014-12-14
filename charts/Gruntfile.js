module.exports = function (grunt) {

	// Config
	grunt.initConfig(require('./grunt/config')(grunt));

	// Load tools
	grunt.loadNpmTasks('cogwheels-tools');

	// Load tasks
	grunt.loadTasks('grunt/tasks');

	// Default task
	grunt.registerTask('default', ['ci']);

};
