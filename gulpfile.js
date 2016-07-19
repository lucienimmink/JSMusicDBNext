var gulp = require('gulp'),
    tsc = require('gulp-typescript'),
    Builder = require('systemjs-builder'),
    inlineNg2Template = require('gulp-inline-ng2-template');
var tsProject = tsc.createProject('./tsconfig.json');

gulp.task('bundle', ['bundle-app', 'bundle-dependencies'], function () { });

gulp.task('inline-templates', function () {
    var tsResult = tsProject.src()
        .pipe(tsc(tsProject))
    return tsResult.js.pipe(gulp.dest('dist/app'));
});

gulp.task('bundle-app', ['inline-templates'], function () {
    // optional constructor options
    // sets the baseURL and loads the configuration file
    var builder = new Builder('', 'dist-systemjs.config.js');

    return builder
        .bundle('dist/app/**/* - [@angular/**/*.js] - [rxjs/**/*.js]', 'bundles/app.bundle.js', { minify: true })
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
        .bundle('dist/app/**/*.js - [dist/app/**/*.js]', 'bundles/dependencies.bundle.js', { minify: true })
        .then(function () {
            console.log('Build complete');
        })
        .catch(function (err) {
            console.log('Build error');
            console.log(err);
        });
});