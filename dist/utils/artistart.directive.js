System.register(['@angular/core', "./artistart.service"], function(exports_1, context_1) {
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
    var ArtistArtDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (artistart_service_1_1) {
                artistart_service_1 = artistart_service_1_1;
            }],
        execute: function() {
            ArtistArtDirective = (function () {
                function ArtistArtDirective(el, artistartservice) {
                    this.artistartservice = artistartservice;
                    this.el = el.nativeElement;
                }
                ArtistArtDirective.prototype.ngOnInit = function () {
                    var _this = this;
                    this.artistartservice.getArtistArt(this.artist.name)
                        .subscribe(function (data) { return _this.el.style.backgroundImage = "url(" + data + ")"; }, function (error) { return console.log('error', error); });
                };
                __decorate([
                    core_1.Input('artistArt'), 
                    __metadata('design:type', Object)
                ], ArtistArtDirective.prototype, "artist", void 0);
                ArtistArtDirective = __decorate([
                    core_1.Directive({
                        selector: '[artistArt]',
                        providers: [artistart_service_1.ArtistArtService]
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, artistart_service_1.ArtistArtService])
                ], ArtistArtDirective);
                return ArtistArtDirective;
            }());
            exports_1("ArtistArtDirective", ArtistArtDirective);
        }
    }
});
//# sourceMappingURL=artistart.directive.js.map