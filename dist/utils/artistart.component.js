System.register(["@angular/core", './artistart.service'], function(exports_1, context_1) {
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
    var core_1, artistart_service_1;
    var ArtistArt;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (artistart_service_1_1) {
                artistart_service_1 = artistart_service_1_1;
            }],
        execute: function() {
            ArtistArt = (function () {
                function ArtistArt(artistArtService) {
                    this.artistArtService = artistArtService;
                    this.artistart = {};
                    this.artistart = {
                        url: '/global/images/no-cover.png',
                        name: 'unknown artist'
                    };
                }
                ArtistArt.prototype.setArtist = function (artist) {
                    var _this = this;
                    this.artistart.name = artist.name;
                    this.artistArtService.getArtistArt(artist.name)
                        .subscribe(function (data) { return _this.artistart.url = data; }, function (error) { return console.log('error', error); });
                };
                ArtistArt = __decorate([
                    core_1.Component({
                        selector: 'artistart',
                        templateUrl: 'app/utils/artistart.component.html',
                        providers: [artistart_service_1.ArtistArtService]
                    }), 
                    __metadata('design:paramtypes', [artistart_service_1.ArtistArtService])
                ], ArtistArt);
                return ArtistArt;
            }());
            exports_1("ArtistArt", ArtistArt);
        }
    }
});
//# sourceMappingURL=artistart.component.js.map