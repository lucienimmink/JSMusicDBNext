"use strict";
var Artist = (function () {
    function Artist(json) {
        this.albums = [];
        this.name = json.name || json.artist;
        this.albumArtist = json.albumartist || json.albumArtist;
        this.sortName = (this.albumArtist) ? this.albumArtist.toUpperCase() : (json.sortName) ? json.sortName.toUpperCase() : this.name.toUpperCase();
        this.bio = json.bio;
    }
    Artist.prototype.url = function () {
        return "/letter/" + this.letter.escapedLetter + "/artist/" + encodeURIComponent(this.albumArtist || this.name) + "/";
    };
    Artist.prototype.sortAlbumsBy = function (sortkey, direction) {
        if (sortkey === void 0) { sortkey = 'name'; }
        if (direction === void 0) { direction = 'asc'; }
        this.albums.sort(function (a, b) {
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
    Artist.prototype.sortAndReturnAlbumsBy = function (sortkey, direction) {
        if (sortkey === void 0) { sortkey = 'name'; }
        if (direction === void 0) { direction = 'asc'; }
        this.sortAlbumsBy(sortkey, direction);
        return this.albums;
    };
    return Artist;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Artist;
//# sourceMappingURL=Artist.js.map