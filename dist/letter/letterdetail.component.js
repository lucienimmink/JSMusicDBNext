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
var artist_component_1 = require('./../artist/artist.component');
var path_service_1 = require('./../utils/path.service');
var LetterDetailComponent = (function () {
    function LetterDetailComponent(coreService, router, routeParams, pathService) {
        this.coreService = coreService;
        this.router = router;
        this.routeParams = routeParams;
        this.pathService = pathService;
        this.letter = 'N';
        this.artists = [];
    }
    LetterDetailComponent.prototype.ngOnInit = function () {
        this.letter = decodeURIComponent(this.routeParams.get('letter'));
        var core = this.coreService.getCore();
        var coreletter = core.letters[this.letter];
        if (coreletter) {
            this.pathService.announcePath(null);
            this.artists = coreletter.sortAndReturnArtistsBy('name', 'asc');
        }
    };
    LetterDetailComponent.prototype.onSelect = function (artist) {
        this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
    };
    LetterDetailComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/letter/letterdetail.component.html',
            directives: [artist_component_1.ArtistComponent],
            styleUrls: ['app/letter/letterdetail.component.css']
        }), 
        __metadata('design:paramtypes', [core_service_1.CoreService, router_deprecated_1.Router, router_deprecated_1.RouteParams, path_service_1.PathService])
    ], LetterDetailComponent);
    return LetterDetailComponent;
}());
exports.LetterDetailComponent = LetterDetailComponent;
//# sourceMappingURL=letterdetail.component.js.map