var gulp = require('gulp')
var gutil = require('gulp-util')
var concat = require('gulp-concat')
var rename = require('gulp-rename')
var sass = require('gulp-sass')
var minifyCSS = require('gulp-minify-css')

gulp.task('default', ['build'])
gulp.task('build', ['sass'])

gulp.task('sass', function() {
    gulp.src('app/Resources/scss/itsgoingtobe.scss')
        .pipe(sass({includePaths: require('node-neat').includePaths.concat('app/Resources/scss')}))
        .pipe(rename('itsgoingtobe.css'))
        .pipe(gulp.dest('web/css'))
        .pipe(minifyCSS())
        .pipe(rename('itsgoingtobe.min.css'))
        .pipe(gulp.dest('web/css'))
        .on('error', gutil.log)
});
