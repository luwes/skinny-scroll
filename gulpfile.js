
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var browserify = require('gulp-browserify');

var paths = {
	scripts: 'src/*.js'
};

var wrapTemplate =
	'(function(window, document) {' +
		'<%= contents %>' +
	'})(window, document);';

gulp.task('scripts', function() {
	gulp.src(paths.scripts)
		.pipe(concat('skinny-scroll.js'))
		.pipe(wrap(wrapTemplate))
		//.pipe(browserify())
		.pipe(uglify())
		.pipe(gulp.dest(''));
});

gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['scripts']);
