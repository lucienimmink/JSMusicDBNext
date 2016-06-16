"use strict";
var MediaSource = (function () {
    function MediaSource(json) {
        this.url = json.file || json.url || json.id;
    }
    return MediaSource;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MediaSource;
//# sourceMappingURL=MediaSource.js.map