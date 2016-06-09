System.register(['./org/arielext/musicdb/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1;
    var CoreService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            CoreService = (function () {
                function CoreService() {
                    this.core = null;
                    this.core = new core_1.musicdbcore();
                }
                CoreService.prototype.getCore = function () {
                    return this.core;
                };
                return CoreService;
            }());
            exports_1("CoreService", CoreService);
        }
    }
});
//# sourceMappingURL=core.service.js.map