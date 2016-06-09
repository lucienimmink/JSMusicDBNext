System.register(['./models/Artist', './models/Album', './models/Track', './models/Letter'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Artist_1, Album_1, Track_1, Letter_1;
    var VERSION, musicdbcore;
    return {
        setters:[
            function (Artist_1_1) {
                Artist_1 = Artist_1_1;
            },
            function (Album_1_1) {
                Album_1 = Album_1_1;
            },
            function (Track_1_1) {
                Track_1 = Track_1_1;
            },
            function (Letter_1_1) {
                Letter_1 = Letter_1_1;
            }],
        execute: function() {
            VERSION = "1.0.0";
            musicdbcore = (function () {
                function musicdbcore() {
                    this.artists = {};
                    this.albums = {};
                    this.tracks = {};
                    this.letters = {};
                    this.sortedLetters = [];
                    this.totals = {
                        artists: 0,
                        albums: 0,
                        tracks: 0,
                        playingTime: 0,
                        parsingTime: 0
                    };
                    console.log("Core init " + VERSION);
                }
                musicdbcore.prototype.instanceIfPresent = function (core, key, map, obj, excecuteIfNew) {
                    var ret = null;
                    if (map[key]) {
                        ret = map[key];
                    }
                    else {
                        map[key] = obj;
                        ret = obj;
                        excecuteIfNew(core);
                    }
                    return ret;
                };
                musicdbcore.prototype.handleLetter = function (letter) {
                    return this.instanceIfPresent(this, letter.letter, this.letters, letter, function (core) { });
                };
                musicdbcore.prototype.handleArtist = function (letter, artist) {
                    return this.instanceIfPresent(this, artist.sortName, this.artists, artist, function (core) {
                        letter.artists.push(artist);
                        artist.letter = letter;
                        core.totals.artists++;
                    });
                };
                musicdbcore.prototype.handleAlbum = function (artist, album) {
                    return this.instanceIfPresent(this, album.sortName, this.albums, album, function (core) {
                        album.artist = artist;
                        artist.albums.push(album);
                        core.totals.albums++;
                    });
                };
                musicdbcore.prototype.handleTrack = function (artist, album, track) {
                    return this.instanceIfPresent(this, track.id, this.tracks, track, function (core) {
                        core.totals.tracks++;
                        core.totals.playingTime += track.duration;
                        track.artist = artist;
                        track.album = album;
                        album.tracks.push(track);
                        // group by discnumber
                        var disc = track.disc;
                        if (!album.discs[disc - 1]) {
                            album.discs[disc - 1] = [];
                            album.discs[disc - 1].push(track);
                        }
                        else {
                            album.discs[disc - 1].push(track);
                        }
                    });
                };
                musicdbcore.prototype.parseLine = function (line) {
                    var letter = new Letter_1.default(line);
                    letter = this.handleLetter(letter);
                    var artist = new Artist_1.default(line);
                    artist = this.handleArtist(letter, artist);
                    var album = new Album_1.default(line);
                    album = this.handleAlbum(artist, album);
                    var track = new Track_1.default(line);
                    track = this.handleTrack(artist, album, track);
                };
                ;
                musicdbcore.prototype.parseTree = function (tree) {
                    for (var l in tree) {
                        var letter = new Letter_1.default(tree[l]);
                        letter = this.handleLetter(letter);
                        for (var a in tree[l].artists) {
                            // add artist in letter
                            var artist = new Artist_1.default(tree[l].artists[a]);
                            artist = this.handleArtist(letter, artist);
                            for (var aa in tree[l].artists[a].albums) {
                                // add albums in artist in letter
                                var album = new Album_1.default(tree[l].artists[a].albums[aa]);
                                album = this.handleAlbum(artist, album);
                                for (var t in tree[l].artists[a].albums[aa].tracks) {
                                    var track = new Track_1.default(tree[l].artists[a].albums[aa].tracks[t]);
                                    track = this.handleTrack(artist, album, track);
                                }
                            }
                        }
                    }
                };
                ;
                musicdbcore.prototype.parseSourceJson = function (json) {
                    var start = new Date().getTime();
                    if (json.length) {
                        // this json is flat; all lines in the json is 1 track
                        for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
                            var line = json_1[_i];
                            this.parseLine(line);
                        }
                    }
                    else if (json.tree) {
                        // this json is build up as an object; with nested data
                        this.parseTree(json.tree);
                    }
                    // sort letters
                    var sorted = Object.keys(this.letters).sort(function (a, b) {
                        return (a < b) ? -1 : 1;
                    });
                    var t = [];
                    var core = this;
                    sorted.forEach(function (value, index) {
                        t.push(core.letters[value]);
                    });
                    this.sortedLetters = t;
                    // update parsing time
                    this.totals.parsingTime += (new Date().getTime() - start);
                };
                return musicdbcore;
            }());
            exports_1("musicdbcore", musicdbcore);
        }
    }
});
//# sourceMappingURL=core.js.map