/*global module:false*/
module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		// Task configuration.
		uglify: {
			options: {
				enclose: {
					'window,document': 'window,document'
				}
			},
			minify: {
				files: {
					'skinny-scroll.min.js': [
						'src/*.js',
					]
				}
			},
			beautify: {
				options: {
					beautify: true,
					mangle: false
				},
				files: {
					'skinny-scroll.js': [
						'src/*.js',
					]
				}
			}
		},
		watch: {
			js: {
				files: 'src/*.js',
				tasks: ['uglify']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task.
	grunt.registerTask('default', ['uglify']);
};
