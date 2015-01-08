module.exports = function (grunt) {

	// Build product
	grunt.registerTask('build', ['jshint', 'clean:web', 'build-product']);

	// Development mode, watch all files and rebuild + run tests
	grunt.registerTask('develop', ['build', 'watch:all']);

};
