var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');

/*
 * These are the commands to be run on command line
 */
gulp.task('default', ['build']);
gulp.task('build', ['ng:js', 'ng:sass']);
gulp.task('develop', ['continuous-build']);

/*
 * These are to helper tasks.
 */
gulp.task('ng:clean', function () {
    gulp.src(['web/js/itsgoingtobe.js','web/js/itsgoingtobe.min.js'], {read: false})
    	.pipe(clean({force: true}));
});

gulp.task('ng:js', ['ng:clean'], function() {
	gulp.src('app/Resources/js/**/*.js')
	 	.pipe(jshint())
	 	.pipe(jshint.reporter(stylish))
	 	.pipe(concat('itsgoingtobe.js'))
	 	.pipe(gulp.dest('web/js/'))
	    	.pipe(uglify())
	    	.pipe(rename('itsgoingtobe.min.js'))
	    	.pipe(gulp.dest('web/js/'))
	    	.on('error', gutil.log);
});

gulp.task('ng:sass', function() {
	gulp.src('app/Resources/scss/itsgoingtobe.scss')
    	.pipe(sass({includePaths: require('node-neat').includePaths}))
    	.pipe(rename('itsgoingtobe.css'))
    	.pipe(gulp.dest('web/css'))
    	.pipe(minifyCSS())
    	.pipe(rename('itsgoingtobe.min.css'))
    	.pipe(gulp.dest('web/css'));
});

gulp.task('continuous-build', function() {
	// js
	gulp.start('ng:js');
	gulp.watch(['app/Resources/js/**/*.js'], function(files) {
		gulp.start('ng:js');
	});

	// sass
	gulp.start('ng:sass');
	gulp.watch(['app/Resources/scss/**/*.scss'], function(files) {
		gulp.start('ng:sass');
	});
});