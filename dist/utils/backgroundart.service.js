System.register(["@angular/core", "@angular/http", "rxjs/Observable", 'lodash'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, Observable_1, _;
    var NOIMAGE, BackgroundArtService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (_1) {
                _ = _1;
            }],
        execute: function() {
            NOIMAGE = 'global/images/no-cover.png';
            BackgroundArtService = (function () {
                function BackgroundArtService(http) {
                    this.http = http;
                    this.cacheMap = {};
                }
                BackgroundArtService.prototype.getMediaArt = function (media) {
                    this.media = media;
                    var cached = this.getFromCache(media);
                    if (cached) {
                        console.log('got cached URL', cached);
                        return cached;
                    }
                    var urlSearchParams = new http_1.URLSearchParams();
                    urlSearchParams.set('limit', '1');
                    if (media.artist) {
                        urlSearchParams.set('q', "album:" + media.name + "+artist:" + media.artist.name);
                        urlSearchParams.set('type', 'album');
                    }
                    else {
                        urlSearchParams.set('q', "" + media.name);
                        urlSearchParams.set('type', 'artist');
                    }
                    var query = {
                        search: urlSearchParams
                    };
                    return this.http.get('//api.spotify.com/v1/search', query)
                        .map(this.extractData)
                        .catch(this.handleError);
                };
                BackgroundArtService.prototype.getFromCache = function (media) {
                    if (media.artist) {
                        return this.cacheMap[media.artist.sortName + "|" + media.sortName];
                    }
                    else {
                        return this.cacheMap[media.sortName];
                    }
                };
                BackgroundArtService.prototype.getMediaArtFromLastFm = function (media) {
                    var cached = this.getFromCache(media);
                    if (cached) {
                        console.log('got cached URL', cached);
                        return cached;
                    }
                    var urlSearchParams = new http_1.URLSearchParams();
                    urlSearchParams.set('method', 'artist.getinfo');
                    urlSearchParams.set('api_key', '956c1818ded606576d6941de5ff793a5');
                    urlSearchParams.set('artist', media.name);
                    urlSearchParams.set('format', 'json');
                    urlSearchParams.set('autoCorrect', 'true');
                    if (media.artist) {
                        urlSearchParams.set('method', 'album.getinfo');
                        urlSearchParams.set('artist', media.artist.name);
                        urlSearchParams.set('album', media.name);
                    }
                    var query = {
                        search: urlSearchParams
                    };
                    return this.http.get('//ws.audioscrobbler.com/2.0/', query)
                        .map(this.extractLastFM)
                        .catch(this.handleError);
                };
                BackgroundArtService.prototype.extractData = function (res) {
                    var json = res.json();
                    if (json && json.albums && json.albums.items && json.albums.items.length > 0 && json.albums.items[0].images[0]) {
                        this.cacheMap[this.media.artist.sortName + "|" + this.media.sortName] = json.albums.items[0].images[0].url;
                        return (json.albums.items[0].images[0].url || NOIMAGE);
                    }
                    else if (json && json.artists && json.artists.items && json.artists.items.length > 0 && json.artists.items[0].images[0]) {
                        this.cacheMap[this.media.sortName] = json.artists.items[0].images[0].url;
                        return (json.artists.items[0].images[0].url || NOIMAGE);
                    }
                    return NOIMAGE;
                };
                BackgroundArtService.prototype.extractLastFM = function (res) {
                    var json = res.json();
                    var image = NOIMAGE;
                    var c = this;
                    if (json && json.album) {
                        _.each(json.album.image, function (e) {
                            if (e.size === "mega") {
                                image = e["#text"];
                                c.cacheMap[c.media.artist.sortName + "|" + c.media.sortName] = image;
                            }
                        });
                    }
                    else if (json && json.artist) {
                        _.each(json.artist.image, function (e) {
                            if (e.size === "mega") {
                                image = e["#text"];
                                c.cacheMap[c.media.sortName] = image;
                            }
                        });
                    }
                    return image || NOIMAGE;
                };
                BackgroundArtService.prototype.handleError = function (error) {
                    return Observable_1.Observable.throw(NOIMAGE);
                };
                BackgroundArtService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], BackgroundArtService);
                return BackgroundArtService;
            }());
            exports_1("BackgroundArtService", BackgroundArtService);
        }
    }
});
//# sourceMappingURL=backgroundart.service.js.map