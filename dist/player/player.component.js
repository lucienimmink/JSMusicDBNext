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
var player_service_1 = require('./player.service');
var router_deprecated_1 = require('@angular/router-deprecated');
var albumart_component_1 = require('./../utils/albumart.component');
var PlayerComponent = (function () {
    function PlayerComponent(playerService, router) {
        var _this = this;
        this.playerService = playerService;
        this.router = router;
        this.showPlayer = false;
        this.subscription = this.playerService.playlistAnnounced$.subscribe(function (playerData) {
            _this.playlist = playerData.playlist;
            _this.trackIndex = playerData.startIndex;
            _this.showPlayer = true;
            _this.setTrack();
        });
    }
    PlayerComponent.prototype.setTrack = function () {
        var c = this;
        setTimeout(function () {
            if (c.albumart)
                c.albumart.ngOnInit();
        });
        this.track = this.playlist.tracks[this.trackIndex];
    };
    PlayerComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe(); // prevent memory leakage
    };
    PlayerComponent.prototype.navigateToArtist = function () {
        this.router.navigate(['Artist', { letter: this.track.album.artist.letter.escapedLetter, artist: this.track.album.artist.sortName }]);
    };
    PlayerComponent.prototype.navigateToAlbum = function () {
        this.router.navigate(['Album', { letter: this.track.album.artist.letter.escapedLetter, artist: this.track.album.artist.sortName, album: this.track.album.sortName }]);
    };
    __decorate([
        core_1.ViewChild(albumart_component_1.AlbumArt), 
        __metadata('design:type', albumart_component_1.AlbumArt)
    ], PlayerComponent.prototype, "albumart", void 0);
    PlayerComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/player/player.component.html',
            selector: 'mdb-player',
            directives: [albumart_component_1.AlbumArt],
            styleUrls: ['app/player/player.component.css']
        }), 
        __metadata('design:paramtypes', [player_service_1.PlayerService, router_deprecated_1.Router])
    ], PlayerComponent);
    return PlayerComponent;
}());
exports.PlayerComponent = PlayerComponent;
//# sourceMappingURL=player.component.js.map