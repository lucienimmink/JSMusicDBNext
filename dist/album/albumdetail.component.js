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
var albumart_component_1 = require('./../utils/albumart.component');
var backgroundart_directive_1 = require('./../utils/backgroundart.directive');
var timeformat_pipe_1 = require('./../timeformat.pipe');
var path_service_1 = require('./../utils/path.service');
var player_service_1 = require('./../player/player.service');
var AlbumDetailComponent = (function () {
    function AlbumDetailComponent(coreService, router, routeParams, pathService, playerService) {
        this.coreService = coreService;
        this.router = router;
        this.routeParams = routeParams;
        this.pathService = pathService;
        this.playerService = playerService;
        this.albumName = '';
        this.artistName = '';
    }
    AlbumDetailComponent.prototype.ngOnInit = function () {
        var c = this;
        this.albumName = decodeURIComponent(this.routeParams.get('album'));
        this.artistName = decodeURIComponent(this.routeParams.get('artist'));
        var core = this.coreService.getCore();
        this.album = core.albums[this.artistName + '|' + this.albumName];
        if (this.album) {
            this.pathService.announcePath({ artist: this.album.artist, album: this.album });
        }
    };
    AlbumDetailComponent.prototype.onSelect = function (track) {
        this.playerService.doPlayAlbum(this.album, this.album.tracks.indexOf(track));
    };
    AlbumDetailComponent.prototype.navigateToArtist = function (artist) {
        this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
    };
    AlbumDetailComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/album/albumdetail.component.html',
            pipes: [timeformat_pipe_1.TimeFormatPipe],
            directives: [albumart_component_1.AlbumArt, backgroundart_directive_1.BackgroundArtDirective],
            styleUrls: ['app/album/albumdetail.component.css']
        }), 
        __metadata('design:paramtypes', [core_service_1.CoreService, router_deprecated_1.Router, router_deprecated_1.RouteParams, path_service_1.PathService, player_service_1.PlayerService])
    ], AlbumDetailComponent);
    return AlbumDetailComponent;
}());
exports.AlbumDetailComponent = AlbumDetailComponent;
//# sourceMappingURL=albumdetail.component.js.map