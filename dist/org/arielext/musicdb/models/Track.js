"use strict";
var MediaSource_1 = require("./MediaSource");
var Track = (function () {
    function Track(json) {
        this.id = json.id;
        this.duration = (json.seconds) ? json.seconds * 1000 : (json.duration && !isNaN(json.duration)) ? json.duration : 0;
        this.title = json.title;
        this.source = new MediaSource_1.default(json);
        this.disc = json.disc || this.guessBySource(json);
        this.number = json.number;
    }
    Track.prototype.guessBySource = function (json) {
        var guessable = this.source.url;
        var discs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        for (var _i = 0, discs_1 = discs; _i < discs_1.length; _i++) {
            var i = discs_1[_i];
            if (guessable.indexOf(" - " + i + ".") !== -1 || guessable.indexOf("(" + i + ") - ") !== -1 || guessable.indexOf("CD" + i) !== -1 || guessable.indexOf("\\" + i + "-") !== -1) {
                return i;
            }
        }
        return 1;
    };
    Track.prototype.url = function () {
        return "/letter/" + this.artist.letter.escapedLetter + "/artist/" + encodeURIComponent(this.artist.name) + "/album/" + encodeURIComponent(this.album.name) + "/track/" + encodeURIComponent(this.title);
    };
    return Track;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Track;
//# sourceMappingURL=Track.js.map