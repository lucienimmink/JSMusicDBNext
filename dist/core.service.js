"use strict";
var core_1 = require('./org/arielext/musicdb/core');
var CoreService = (function () {
    function CoreService() {
        this.core = null;
        this.core = new core_1.musicdbcore();
    }
    CoreService.prototype.getCore = function () {
        return this.core;
    };
    return CoreService;
}());
exports.CoreService = CoreService;
//# sourceMappingURL=core.service.js.map