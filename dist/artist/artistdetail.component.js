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
var router_deprecated_1 = require('@angular/router-deprecated');
var core_service_1 = require('./../core.service');
var album_component_1 = require('./../album/album.component');
var backgroundart_directive_1 = require('./../utils/backgroundart.directive');
var path_service_1 = require('./../utils/path.service');
var ArtistDetailComponent = (function () {
    function ArtistDetailComponent(coreService, router, routeParams, pathService) {
        this.coreService = coreService;
        this.router = router;
        this.routeParams = routeParams;
        this.pathService = pathService;
        this.albums = [];
    }
    ArtistDetailComponent.prototype.ngOnInit = function () {
        var artistName = decodeURIComponent(this.routeParams.get('artist'));
        var core = this.coreService.getCore();
        this.artist = core.artists[artistName];
        if (this.artist) {
            this.pathService.announcePath({ artist: this.artist });
            this.albums = this.artist.sortAndReturnAlbumsBy('year', 'desc');
        }
    };
    ArtistDetailComponent.prototype.onSelect = function (album) {
        this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
    };
    ArtistDetailComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/artist/artistdetail.component.html',
            styleUrls: ['app/artist/artistdetail.component.css'],
            directives: [album_component_1.AlbumComponent, backgroundart_directive_1.BackgroundArtDirective]
        }), 
        __metadata('design:paramtypes', [core_service_1.CoreService, router_deprecated_1.Router, router_deprecated_1.RouteParams, path_service_1.PathService])
    ], ArtistDetailComponent);
    return ArtistDetailComponent;
}());
exports.ArtistDetailComponent = ArtistDetailComponent;
//# sourceMappingURL=artistdetail.component.js.map