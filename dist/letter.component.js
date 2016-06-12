System.register(["@angular/core", '@angular/router-deprecated', './core.service'], function(exports_1, context_1) {
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
    var LetterComponent;
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
            LetterComponent = (function () {
                function LetterComponent(coreService, router) {
                    this.coreService = coreService;
                    this.router = router;
                }
                LetterComponent.prototype.ngOnInit = function () {
                    var core = this.coreService.getCore();
                    this.letters = core.sortedLetters;
                };
                LetterComponent.prototype.onSelect = function (letter) {
                    this.router.navigate(['Letter', { letter: letter.escapedLetter }]);
                };
                LetterComponent = __decorate([
                    core_1.Component({
                        selector: 'letters',
                        templateUrl: 'app/letter.component.html',
                        styleUrls: ['app/letter.component.css']
                    }), 
                    __metadata('design:paramtypes', [core_service_1.CoreService, router_deprecated_1.Router])
                ], LetterComponent);
                return LetterComponent;
            }());
            exports_1("LetterComponent", LetterComponent);
        }
    }
});
//# sourceMappingURL=letter.component.js.map