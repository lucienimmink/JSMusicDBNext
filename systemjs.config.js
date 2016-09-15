/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: 'dist',
            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            // other libraries
            'rxjs': 'npm:rxjs',
            'lodash': 'npm:lodash',
            'angular2-jwt': 'npm:angular2-jwt',
            'ng2-bootstrap': 'npm:ng2-bootstrap',
            'moment': 'npm:moment',
            'pouchdb': 'npm:pouchdb',
            'jsrsasign': './global/js'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: { main: './main.js', defaultExtension: 'js' },
            rxjs: { defaultExtension: 'js' },
            'lodash': { main: 'lodash.js', defaultExtension: 'js' },
            'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
            'angular2-jwt': { main: 'angular2-jwt.js', defaultExtension: 'js' },
            'ng2-bootstrap': { main: 'ng2-bootstrap.js', defaultExtension: 'js' },
            'moment': { main: 'moment.js', defaultExtension: 'js' },
            'pouchdb': { main: 'dist/pouchdb.js', defaultExtension: 'js' },
            'jsrsasign': { main: 'jsrsasign.js' }
        },
        meta: {
            'pouchdb': { format: 'commonjs' }
        }
    });
})(this);