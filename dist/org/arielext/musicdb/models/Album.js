"use strict";
var Album = (function () {
    function Album(json) {
        this.tracks = [];
        this.discs = [];
        this.name = json.album;
        this.sortName = this.name.toUpperCase();
        this.year = json.year;
    }
    Album.prototype.url = function () {
        return "/letter/" + this.artist.letter.escapedLetter + "/artist/" + encodeURIComponent(this.artist.name) + "/album/" + encodeURIComponent(this.name);
    };
    return Album;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Album;
//# sourceMappingURL=Album.js.map