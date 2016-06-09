System.register(["lodash"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _;
    var Letter;
    return {
        setters:[
            function (_1) {
                _ = _1;
            }],
        execute: function() {
            Letter = (function () {
                function Letter(json) {
                    this.artists = [];
                    this.letter = json.letter || this.getFirstLetterOf(json.albumArtist || json.artist);
                    if (this.letter === "1")
                        this.letter = "#";
                    this.escapedLetter = encodeURIComponent(this.letter);
                }
                ;
                Letter.prototype.url = function () {
                    return "/letter/" + this.escapedLetter + "/";
                };
                ;
                Letter.prototype.getFirstLetterOf = function (name) {
                    return this.stripFromName(name, 'the ');
                };
                ;
                Letter.prototype.stripFromName = function (name, strip) {
                    var s = strip.toUpperCase();
                    var f = name.toUpperCase();
                    f = _.trim(f);
                    f = _.trimStart(f, s);
                    return this.groupIfSpecialChar(_.split(f, '', 1)[0]);
                };
                Letter.prototype.groupIfSpecialChar = function (c) {
                    if (_.indexOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '(', ')', '[', ']', '{', '}', '_', '-', '.'], c) !== -1) {
                        return '#';
                    }
                    return c;
                };
                Letter.prototype.sortArtistsBy = function (sortkey, direction) {
                    if (sortkey === void 0) { sortkey = 'name'; }
                    if (direction === void 0) { direction = 'asc'; }
                    this.artists.sort(function (a, b) {
                        if (sortkey.indexOf('.') !== -1) {
                            var sorter = sortkey.split(".");
                            if (a[sorter[0]][sorter[1]] < b[sorter[0]][sorter[1]]) {
                                return (direction === 'asc') ? -1 : 1;
                            }
                            else if (a[sorter[0]][sorter[1]] > b[sorter[0]][sorter[1]]) {
                                return (direction === 'asc') ? 1 : -1;
                            }
                            else {
                                return 0;
                            }
                        }
                        if (a[sortkey] < b[sortkey]) {
                            return (direction === 'asc') ? -1 : 1;
                        }
                        else if (a[sortkey] > b[sortkey]) {
                            return (direction === 'asc') ? 1 : -1;
                        }
                        return 0;
                    });
                };
                Letter.prototype.sortAndReturnArtistsBy = function (sortkey, direction) {
                    if (sortkey === void 0) { sortkey = 'name'; }
                    if (direction === void 0) { direction = 'asc'; }
                    this.sortArtistsBy(sortkey, direction);
                    return this.artists;
                };
                return Letter;
            }());
            exports_1("default", Letter);
        }
    }
});
//# sourceMappingURL=Letter.js.map