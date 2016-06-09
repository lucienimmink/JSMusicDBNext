System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MediaSource;
    return {
        setters:[],
        execute: function() {
            MediaSource = (function () {
                function MediaSource(json) {
                    this.url = json.file || json.url || json.id;
                }
                return MediaSource;
            }());
            exports_1("default", MediaSource);
        }
    }
});
//# sourceMappingURL=MediaSource.js.map