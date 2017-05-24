var gulp = require('gulp');
var gutil = require('gulp-util');
//var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel  = require('gulp-babel');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var shell = require('gulp-shell');
var browserSync;

/*
 * These are the commands to be run on command line
 */
gulp.task('default', ['build']);
gulp.task('test', ['php-lint', 'phpunit']);
gulp.task('build', ['ng:js', 'ng:sass']);
gulp.task('develop', ['continuous-build']);
gulp.task('sync', ['continuous-build-browserSync']);

/*
 * These are to helper tasks.
 */
gulp.task('ng:clean', function () {
    gulp.src(['web/js/itsgoingtobe.js','web/js/itsgoingtobe.min.js'], {read: false})
        .pipe(clean({force: true}));
});

gulp.task('ng:js', ['ng:clean'], function() {
    gulp.src('app/Resources/js/**/*.js')
        //.pipe(jscs())
        //.pipe(jscs.reporter())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(concat('itsgoingtobe.js'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest('web/js/'))
        .pipe(uglify())
        .pipe(rename('itsgoingtobe.min.js'))
        .pipe(gulp.dest('web/js/'))
        .on('error', gutil.log);
});

gulp.task('ng:js-reload', ['ng:js'], function() {
    browserSync.reload;
});

gulp.task('ng:sass', function() {
    gulp.src('app/Resources/scss/itsgoingtobe.scss')
        .pipe(sass({includePaths: require('node-neat').includePaths.concat('app/Resources/scss')}))
        .pipe(rename('itsgoingtobe.css'))
        .pipe(gulp.dest('web/css'))
        .pipe(minifyCSS())
        .pipe(rename('itsgoingtobe.min.css'))
        .pipe(gulp.dest('web/css'))
        .on('error', gutil.log);
});

gulp.task('ng:sass-reload', ['ng:sass'], function() {
    browserSync.reload;
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

gulp.task('continuous-build-browserSync', function() {
    browserSync = require('browser-sync').create();

    // js
    gulp.start('ng:js');
    gulp.watch(['app/Resources/js/**/*.js'], function(files) {
        gulp.start('ng:js-reload');
    });

    // sass
    gulp.start('ng:sass');
    gulp.watch(['app/Resources/scss/**/*.scss'], function(files) {
        gulp.start('ng:sass-reload');
    });

    gulp.watch('app/Resources/views/**/*.twig').on('change', browserSync.reload);

    browserSync.init({
        proxy: 'itsgoingtobe.local/app_dev.php'
    });
});

gulp.task('doctrine-update', shell.task([
  'php app/console doctrine:schema:update --force'
]));

gulp.task('php-lint', shell.task([
    'bin/phpcbf --standard=PSR2 src',
    'bin/phpcs --standard=PSR2 src',
    'bin/phplint src'
]));

gulp.task('phpunit', shell.task([
    'bin/phpunit -c app'
]));
