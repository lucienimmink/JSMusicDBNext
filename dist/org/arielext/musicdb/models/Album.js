System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Album;
    return {
        setters:[],
        execute: function() {
            Album = (function () {
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
            exports_1("default", Album);
        }
    }
});
//# sourceMappingURL=Album.js.map