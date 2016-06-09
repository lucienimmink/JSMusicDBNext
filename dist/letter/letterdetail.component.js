System.register(["@angular/core", '@angular/router-deprecated', './../core.service'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, core_service_1;
    var LetterDetailComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (core_service_1_1) {
                core_service_1 = core_service_1_1;
            }],
        execute: function() {
            LetterDetailComponent = (function () {
                function LetterDetailComponent(coreService, router, routeParams) {
                    this.coreService = coreService;
                    this.router = router;
                    this.routeParams = routeParams;
                    this.letter = 'N';
                    this.artists = [];
                }
                LetterDetailComponent.prototype.ngOnInit = function () {
                    this.letter = decodeURIComponent(this.routeParams.get('letter'));
                    var core = this.coreService.getCore();
                    this.artists = core.letters[this.letter].artists;
                };
                LetterDetailComponent.prototype.onSelect = function (artist) {
                    this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
                };
                LetterDetailComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/letter/letterdetail.component.html'
                    }), 
                    __metadata('design:paramtypes', [core_service_1.CoreService, router_deprecated_1.Router, router_deprecated_1.RouteParams])
                ], LetterDetailComponent);
                return LetterDetailComponent;
            }());
            exports_1("LetterDetailComponent", LetterDetailComponent);
        }
    }
});
//# sourceMappingURL=letterdetail.component.js.map