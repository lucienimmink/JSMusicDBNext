"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var _ = require('lodash');
var NOIMAGE = 'global/images/no-cover.png';
var BackgroundArtService = (function () {
    function BackgroundArtService(http) {
        this.http = http;
    }
    BackgroundArtService.prototype.getMediaArt = function (media) {
        var urlSearchParams = new http_1.URLSearchParams();
        urlSearchParams.set('limit', '1');
        var mediaartUrl = '';
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
    BackgroundArtService.prototype.getMediaArtFromLastFm = function (media) {
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
            return (json.albums.items[0].images[0].url || NOIMAGE);
        }
        else if (json && json.artists && json.artists.items && json.artists.items.length > 0 && json.artists.items[0].images[0]) {
            return (json.artists.items[0].images[0].url || NOIMAGE);
        }
        return NOIMAGE;
    };
    BackgroundArtService.prototype.extractLastFM = function (res) {
        var json = res.json();
        var image = NOIMAGE;
        if (json && json.album) {
            _.each(json.album.image, function (e) {
                if (e.size === "mega") {
                    image = e["#text"];
                }
            });
        }
        else if (json && json.artist) {
            _.each(json.artist.image, function (e) {
                if (e.size === "mega") {
                    image = e["#text"];
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
exports.BackgroundArtService = BackgroundArtService;
//# sourceMappingURL=backgroundart.service.js.map