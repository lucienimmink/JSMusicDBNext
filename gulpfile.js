var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    tsc = require('gulp-typescript'),
    Builder = require('systemjs-builder'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    del = require('del'),
    rename = require("gulp-rename"),
    runSequence = require('run-sequence'),
    autoprefixer = require('gulp-autoprefixer'),
    replace = require('gulp-replace'),
    inlineNg2Template = require('gulp-inline-ng2-template');
var tsProject = tsc.createProject('./dist-tsconfig.json');

var prefixZero = function(n) {
    if (n < 10) {
        return "0" + n;
    }
    return n;
}
var d = new Date();
var VERSION = prefixZero(d.getDate()) + "-" + prefixZero(d.getMonth() + 1) + "-" + d.getFullYear() + ", " + prefixZero(d.getHours()) + ":" + prefixZero(d.getMinutes());

gulp.task('bundle', ['bundle-app', 'bundle-css'], function(cb) { cb(); });
gulp.task('copy', ['copy-js', 'copy-css', 'copy-polyfills', 'copy-assets'], function(cb) { cb(); });
gulp.task('copy-assets', ['copy-global', 'copy-fonts', 'copy-root'], function(cb) { cb(); });

gulp.task('build', function(cb) {
    runSequence('clean', 'bundle', 'add-version', 'copy', 'rev', 'revreplace', 'revreplace-electron', 'cleanup', cb);
});

/**
 * individual tasks
 */
gulp.task('clean', function(cb) {
    del([
        './target/css',
        './target/fonts',
        './target/global',
        './target/js',
        './target/dist-systemjs*',
        './target/*manifest.json',
        './target/index.html',
        './target/electron.html',
        './target/sw*.js'
    ]);
    cb();
});

gulp.task('add-version', function() {

    return gulp.src('target/js/app.bundle.js')
        .pipe(replace('__dev__', VERSION))
        .pipe(gulp.dest(function(data) {
            return data.base;
        }));
});

gulp.task('inline-templates', function() {
    var tsResult = tsProject.src()
        .pipe(inlineNg2Template({ UseRelativePaths: true, indent: 0, removeLineBreaks: true }))
        .pipe(tsProject())
    return tsResult.js.pipe(gulp.dest('dist/app'));
});

gulp.task('bundle-css', function(cb) {
    var cssSources = [
        './node_modules/winstrap/dist/css/winstrap.css',
        './dist/sass/base.css',
        './dist/sass/animations.css'
    ];

    return gulp.src(cssSources)
        .pipe(concat('styles.css'))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./target/css/'));
});

gulp.task('copy-polyfills', function(cb) {
    var jsSources = [
        './node_modules/core-js/client/shim.min.js',
        './node_modules/zone.js/dist/zone.js',
        './node_modules/reflect-metadata/Reflect.js',
        './node_modules/hammerjs/hammer.js',
        './node_modules/systemjs/dist/system.src.js'
    ];

    return gulp.src(jsSources)
        .pipe(concat('polyfills.js'))
        .pipe(gulp.dest('./target/js/'));
});

gulp.task('copy-global', function(cb) {
    return gulp.src('./global/**/*')
        .pipe(gulp.dest('./target/global/'));
});

gulp.task('copy-global-dev', function(cb) {
    return gulp.src('./global/**/*')
        .pipe(gulp.dest('./dist/global/'));
});

gulp.task('copy-fonts', function(cb) {
    return gulp.src('./node_modules/winstrap/dist/fonts/**/*')
        .pipe(gulp.dest('./target/fonts/'));
});
gulp.task('copy-root', function(cb) {
    var rootfiles = [
        'manifest.json',
        'sw.js'
    ];
    return gulp.src(rootfiles)
        .pipe(gulp.dest('./target/'));
});

gulp.task('copy-css', function(cb) {
    var rootfiles = [
        './dist/sass/light.css',
        './dist/sass/dark.css'
    ];
    return gulp.src(rootfiles)
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./target/css/'));
});

gulp.task('copy-js', function(cb) {
    return gulp.src('dist-systemjs.config.js')
        .pipe(gulp.dest('./target/js'));
});

gulp.task('cleanup', function(cb) {
    del([
        'target/css/styles.css',
        'target/js/app.bundle.js',
        'target/js/dependencies.bundle.js',
        'target/js/polyfills.js',
        'target/js/dist-systemjs.config.js'
    ]);
    cb();
});

gulp.task('rev', function(cb) {
    var fs = require('fs');
    if (fs.existsSync('target/rev-manifest.json')) {
        console.info('rev-manifest found; using current revs; if you want to rebuild; please use `gulp build` first');
        cb();
    } else {
        var revFiles = [
            './target/**/styles.css',
            './target/**/*.js'
        ]
        return gulp.src(revFiles)
            .pipe(rev())
            .pipe(gulp.dest('./target/'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('./target/'));
    }
});

gulp.task('revreplace', function(cb) {
    var manifest = gulp.src('./target/rev-manifest.json');

    return gulp.src('./target/_index.html')
        .pipe(revReplace({ manifest: manifest }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./target'));
});

gulp.task('revreplace-electron', function(cb) {
    var manifest = gulp.src('./target/rev-manifest.json');

    return gulp.src('./target/_electron.html')
        .pipe(revReplace({ manifest: manifest }))
        .pipe(rename('electron.html'))
        .pipe(gulp.dest('./target'));
});

gulp.task('bundle-app', ['inline-templates'], function(cb) {
    var builder = new Builder('', 'dist-systemjs.config.js');

    builder
        .bundle('dist/app/**/*', 'target/js/app.bundle.js', { minify: true, globalDefs: { DEBUG: false } })
        .then(function() { cb() })
        .catch(function(err) {
            cb(err);
        });
});