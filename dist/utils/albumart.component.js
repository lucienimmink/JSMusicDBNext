System.register(["@angular/core", './../org/arielext/musicdb/models/Album', './albumart.service'], function(exports_1, context_1) {
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
    var core_1, Album_1, albumart_service_1;
    var NOIMAGE, AlbumArt;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Album_1_1) {
                Album_1 = Album_1_1;
            },
            function (albumart_service_1_1) {
                albumart_service_1 = albumart_service_1_1;
            }],
        execute: function() {
            NOIMAGE = 'global/images/no-cover.png';
            AlbumArt = (function () {
                function AlbumArt(albumArtService) {
                    this.albumArtService = albumArtService;
                    this.albumart = {};
                    this.albumart = {
                        url: NOIMAGE,
                        name: 'unknown album'
                    };
                }
                AlbumArt.prototype.ngOnInit = function () {
                    var _this = this;
                    this.albumart.name = this.album.name;
                    this.albumArtService.getAlbumArt(this.album.artist.name, this.album.name)
                        .subscribe(function (data) { return _this.setImage(data); }, function (error) { return _this.albumart.url = NOIMAGE; });
                };
                AlbumArt.prototype.setImage = function (data) {
                    var _this = this;
                    if (data === 'global/images/no-cover.png' || data === '') {
                        this.albumArtService.getMediaArtFromLastFm(this.album.artist.name, this.album.name)
                            .subscribe(function (data) { return _this.albumart.url = data; }, function (error) { return _this.albumart.url = NOIMAGE; });
                    }
                    else {
                        this.albumart.url = data;
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Album_1.default)
                ], AlbumArt.prototype, "album", void 0);
                AlbumArt = __decorate([
                    core_1.Component({
                        selector: 'albumart',
                        templateUrl: 'app/utils/albumart.component.html',
                        providers: [albumart_service_1.AlbumArtService]
                    }), 
                    __metadata('design:paramtypes', [albumart_service_1.AlbumArtService])
                ], AlbumArt);
                return AlbumArt;
            }());
            exports_1("AlbumArt", AlbumArt);
        }
    }
});
//# sourceMappingURL=albumart.component.js.map