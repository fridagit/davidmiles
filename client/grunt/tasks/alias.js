module.exports = function (grunt) {

	// Build product
	grunt.registerTask('build', ['jshint', 'clean:web', 'build-product']);

	// Start karma spec server
	grunt.registerTask('spec-server', ['karma:develop:start']);

	// Run specs against running karma server
	grunt.registerTask('run-specs', ['clean:reports', 'karma:develop:run']);

	// Run all cucumber tests
	grunt.registerTask('cucumber', ['build', 'karma:cucumber']);

	// Development mode, watch all files and rebuild + run tests
	grunt.registerTask('develop', ['build', 'karma:develop:run', 'watch:all']);

	// Continuous integration, build and run tests then return to prompt
	grunt.registerTask('ci', ['build', 'clean:reports', 'karma:ci']);

};
