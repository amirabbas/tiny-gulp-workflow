var gulp          = require("gulp");
var sass          = require("gulp-ruby-sass");
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('gulp-autoprefixer');
var browserSync   = require("browser-sync").create();

var browsers = [
    'ie >= 8',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 30',
    'safari >= 6',
    'opera >= 20',
    'ios >= 6',
    'android >= 2.3',
    'bb >= 10'
]

/**
 * Compile with gulp-ruby-sass + source maps
 */
gulp.task('sass', function () {

    return sass('builds/development/scss', {
        sourcemap: true,
        style: 'expanded',
        precision: 10,
        cacheLocation: 'builds/development/scss/.sass-cache',
        require: ['susy']
    })
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(autoprefixer({
            browsers: browsers,
            cascade: false
        }))
        .pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: '/builds/development/scss'
        }))
        .pipe(gulp.dest('builds/development/css'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./builds/development",
        directory: true,
        port: 9090
    });

    gulp.watch("builds/development/scss/**/*.scss", ['sass']);
    gulp.watch("builds/development/*.html").on('change', browserSync.reload);
});
