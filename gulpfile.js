var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    tsc = require('gulp-typescript'),
    Builder = require('systemjs-builder'),
    inlineNg2Template = require('gulp-inline-ng2-template');
var tsProject = tsc.createProject('./tsconfig.json');

gulp.task('bundle', ['bundle-app', 'bundle-dependencies'], function () { });
gulp.task('build', ['bundle', 'copy'], function () { });
gulp.task('copy', ['copy-css', 'copy-polyfills', 'copy-assets'], function () { });
gulp.task('copy-assets', ['copy-global', 'copy-fonts', 'copy-root'], function () { });

gulp.task('inline-templates', function () {
    var tsResult = tsProject.src()
        .pipe(inlineNg2Template({ UseRelativePaths: true, indent: 0, removeLineBreaks: true}))
        .pipe(tsc(tsProject))
    return tsResult.js.pipe(gulp.dest('dist/app'));
});

gulp.task('copy-css', function () {
    var cssSources = [
        './node_modules/winstrap/dist/css/winstrap.css',
        './dist/sass/base.css',
        './dist/sass/animations.css'
    ];

    return gulp.src(cssSources)
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./target/css/'));
});

gulp.task('copy-polyfills', function () {
    var jsSources = [
        './node_modules/core-js/client/shim.min.js',
        './node_modules/zone.js/dist/zone.js',
        './node_modules/reflect-metadata/Reflect.js',
        './node_modules/systemjs/dist/system.src.js'
    ];

    return gulp.src(jsSources)
        .pipe(concat('polyfills.js'))
        .pipe(gulp.dest('./target/js/'));
});

gulp.task('copy-global', function () {
    return gulp.src('./global/**/*')
        .pipe(gulp.dest('./target/global/'));
});
gulp.task('copy-fonts', function () {
    return gulp.src('./node_modules/winstrap/dist/fonts/**/*')
        .pipe(gulp.dest('./target/fonts/'));
});
gulp.task('copy-root', function () {
    var rootfiles = [
        'dist-systemjs.config.js',
        'manifest.json'
    ];
    return gulp.src(rootfiles)
        .pipe(gulp.dest('./target/'));
});

gulp.task('bundle-app', ['inline-templates'], function () {
    // optional constructor options
    // sets the baseURL and loads the configuration file
    var builder = new Builder('', 'dist-systemjs.config.js');

    return builder
        .bundle('dist/app/**/* - [@angular/**/*.js] - [rxjs/**/*.js]', 'target/js/app.bundle.js', { minify: true })
        .then(function () {
            console.log('Build complete');
        })
        .catch(function (err) {
            console.log('Build error');
            console.log(err);
        });
});

gulp.task('bundle-dependencies', ['inline-templates'], function () {
    // optional constructor options
    // sets the baseURL and loads the configuration file
    var builder = new Builder('', 'dist-systemjs.config.js');

    return builder
        .bundle('dist/app/**/*.js - [dist/app/**/*.js]', 'target/js/dependencies.bundle.js', { minify: true })
        .then(function () {
            console.log('Build complete');
        })
        .catch(function (err) {
            console.log('Build error');
            console.log(err);
        });
});