System.register(["@angular/core", '@angular/router-deprecated', './../utils/artistart.directive'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, artistart_directive_1;
    var ArtistComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (artistart_directive_1_1) {
                artistart_directive_1 = artistart_directive_1_1;
            }],
        execute: function() {
            ArtistComponent = (function () {
                function ArtistComponent(router) {
                    this.router = router;
                    this.artist = {};
                }
                ArtistComponent.prototype.select = function () {
                    this.router.navigate(['Artist', { letter: this.artist.letter.escapedLetter, artist: this.artist.sortName }]);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ArtistComponent.prototype, "artist", void 0);
                ArtistComponent = __decorate([
                    core_1.Component({
                        selector: 'mdbartist',
                        templateUrl: 'app/artist/artist.component.html',
                        directives: [artistart_directive_1.ArtistArtDirective],
                        styleUrls: ['app/artist/artist.component.css']
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.Router])
                ], ArtistComponent);
                return ArtistComponent;
            }());
            exports_1("ArtistComponent", ArtistComponent);
        }
    }
});
//# sourceMappingURL=artist.component.js.map