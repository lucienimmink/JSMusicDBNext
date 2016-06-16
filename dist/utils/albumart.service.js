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
var AlbumArtService = (function () {
    function AlbumArtService(http) {
        this.http = http;
        this.albumartUrl = 'https://api.spotify.com/v1/search?q=album:{1}+artist:{0}&type=album&limit=1';
    }
    AlbumArtService.prototype.getAlbumArt = function (artist, album) {
        return this.http.get(this.albumartUrl.replace('{1}', album).replace('{0}', artist))
            .map(this.extractData)
            .catch(this.handleError);
    };
    AlbumArtService.prototype.getMediaArtFromLastFm = function (artist, album) {
        var urlSearchParams = new http_1.URLSearchParams();
        urlSearchParams.set('api_key', '956c1818ded606576d6941de5ff793a5');
        urlSearchParams.set('artist', artist);
        urlSearchParams.set('format', 'json');
        urlSearchParams.set('autoCorrect', 'true');
        urlSearchParams.set('method', 'album.getinfo');
        urlSearchParams.set('album', album);
        var query = {
            search: urlSearchParams
        };
        return this.http.get('//ws.audioscrobbler.com/2.0/', query)
            .map(this.extractLastFM)
            .catch(this.handleError);
    };
    AlbumArtService.prototype.extractData = function (res) {
        var json = res.json();
        if (json && json.albums && json.albums.items && json.albums.items.length > 0 && json.albums.items[0].images[0]) {
            return (json.albums.items[0].images[0].url || NOIMAGE);
        }
        else if (json && json.artists && json.artists.items && json.artists.items.length > 0 && json.artists.items[0].images[0]) {
            return (json.artists.items[0].images[0].url || NOIMAGE);
        }
        return NOIMAGE;
    };
    AlbumArtService.prototype.extractLastFM = function (res) {
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
    AlbumArtService.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(NOIMAGE);
    };
    AlbumArtService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AlbumArtService);
    return AlbumArtService;
}());
exports.AlbumArtService = AlbumArtService;
//# sourceMappingURL=albumart.service.js.map