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
var collection_service_1 = require('./collection.service');
var core_service_1 = require('./core.service');
var letter_component_1 = require('./letter/letter.component');
var letterdetail_component_1 = require('./letter/letterdetail.component');
var artistdetail_component_1 = require('./artist/artistdetail.component');
var albumdetail_component_1 = require('./album/albumdetail.component');
var topmenu_component_1 = require('./menu/topmenu.component');
var path_service_1 = require('./utils/path.service');
var player_service_1 = require('./player/player.service');
var player_component_1 = require('./player/player.component');
// Add the RxJS Observable operators we need in this app.
require('./rxjs-operators');
var AppComponent = (function () {
    function AppComponent(collectionService, coreService) {
        this.collectionService = collectionService;
        this.coreService = coreService;
        this.letter = 'N';
        this.path = "JSMusicDB Next";
    }
    AppComponent.prototype.ngOnInit = function () {
        this.getCollection();
    };
    AppComponent.prototype.getCollection = function () {
        var _this = this;
        this.collectionService.getCollection()
            .subscribe(function (data) { return _this.fillCollection(data); }, function (error) { return console.log(error); });
    };
    AppComponent.prototype.fillCollection = function (data) {
        this.coreService.getCore().parseSourceJson(data);
        this.letterComponent.ngOnInit();
    };
    __decorate([
        core_1.ViewChild(letter_component_1.LetterComponent), 
        __metadata('design:type', letter_component_1.LetterComponent)
    ], AppComponent.prototype, "letterComponent", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'musicdb',
            templateUrl: 'app/app.component.html',
            providers: [collection_service_1.CollectionService, core_service_1.CoreService, path_service_1.PathService, player_service_1.PlayerService],
            directives: [letter_component_1.LetterComponent, router_deprecated_1.ROUTER_DIRECTIVES, topmenu_component_1.TopMenuComponent, player_component_1.PlayerComponent]
        }),
        router_deprecated_1.RouteConfig([
            { path: '/letter/:letter', name: 'Letter', component: letterdetail_component_1.LetterDetailComponent },
            { path: '/letter/:letter/artist/:artist', name: 'Artist', component: artistdetail_component_1.ArtistDetailComponent },
            { path: '/letter/:letter/artist/:artist/album/:album', name: 'Album', component: albumdetail_component_1.AlbumDetailComponent }
        ]), 
        __metadata('design:paramtypes', [collection_service_1.CollectionService, core_service_1.CoreService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map