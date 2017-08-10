(function(global) {
    var map = {
        'app': 'dist/app',
        '@angular': 'node_modules/@angular',
        'rxjs': 'node_modules/rxjs',
        'lodash': 'node_modules/lodash',
        'angular2-jwt': 'node_modules/angular2-jwt',
        'ng2-bootstrap': 'node_modules/ng2-bootstrap',
        'moment': 'node_modules/moment',
        'pouchdb': 'node_modules/pouchdb',
        'jsrsasign': 'node_modules/jsrsasign',
        'ng2-youtube-player': 'node_modules/ng2-youtube-player',
        'ng2-sticky-kit': 'node_modules/ng2-sticky-kit'
    };
    var packages = {
        'app': { main: 'main.js', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
        'lodash': { main: 'lodash.js', defaultExtension: 'js' },
        'angular2-jwt': { main: 'angular2-jwt.js', defaultExtension: 'js' },
        'ng2-bootstrap': { main: 'bundles/ngx-bootstrap.umd.min.js', defaultExtension: 'js' },
        'moment': { main: 'moment.js', defaultExtension: 'js' },
        'pouchdb': { main: 'dist/pouchdb.js', defaultExtension: 'js' },
        'jsrsasign': { main: 'lib/jsrsasign.js', defaultExtension: 'js' },
        'ng2-youtube-player': { main: 'bundles/ng2-youtube-player.umd.js', defaultExtension: 'js' },
        'ng2-sticky-kit': { main: 'ng2-sticky-kit.js', defaultExtension: 'js' }
    };
    var meta = {
        'pouchdb': { format: 'cjs' },
        'ng2-bootstrap': { format: 'amd' }
    }
    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'forms',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'router'
    ];

    function packIndex(pkgName) {
        //packages['@angular/' + pkgName] = { main: `@angular/${pkgName}.js`, defaultExtension: 'js' };
        packages['@angular/' + pkgName] = { main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
    }
    ngPackageNames.forEach(packIndex);
    var config = {
        map: map,
        packages: packages,
        meta: meta
    }
    System.config(config);
})(this);