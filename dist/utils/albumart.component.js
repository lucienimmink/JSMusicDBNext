System.register(["@angular/core", './albumart.service'], function(exports_1, context_1) {
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
    var core_1, albumart_service_1;
    var AlbumArt;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (albumart_service_1_1) {
                albumart_service_1 = albumart_service_1_1;
            }],
        execute: function() {
            AlbumArt = (function () {
                function AlbumArt(albumArtService) {
                    this.albumArtService = albumArtService;
                    this.albumart = {};
                    this.albumart = {
                        url: '/global/images/no-cover.png',
                        name: 'unknown album'
                    };
                }
                AlbumArt.prototype.setAlbum = function (album) {
                    var _this = this;
                    this.albumart.name = album.name;
                    this.albumArtService.getAlbumArt(album.artist.name, album.name)
                        .subscribe(function (data) { return _this.albumart.url = data; }, function (error) { return console.log('error', error); });
                };
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