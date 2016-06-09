System.register(["@angular/core", './collection.service', './core.service', './rxjs-operators'], function(exports_1, context_1) {
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
    var core_1, collection_service_1, core_service_1;
    var LetterComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (collection_service_1_1) {
                collection_service_1 = collection_service_1_1;
            },
            function (core_service_1_1) {
                core_service_1 = core_service_1_1;
            },
            function (_1) {}],
        execute: function() {
            LetterComponent = (function () {
                function LetterComponent(collectionService, coreService) {
                    this.collectionService = collectionService;
                    this.coreService = coreService;
                    this.letter = 'N';
                }
                LetterComponent.prototype.ngOnInit = function () {
                    this.getCollection();
                };
                LetterComponent.prototype.getCollection = function () {
                    var _this = this;
                    this.collectionService.getCollection()
                        .subscribe(function (data) { return _this.fillCollection(data); }, function (error) { return console.log(error); });
                };
                LetterComponent.prototype.fillCollection = function (data) {
                    var core = this.coreService.getCore();
                    this.letters = core.sortedLetters;
                };
                LetterComponent = __decorate([
                    core_1.Component({
                        selector: 'letters',
                        templateUrl: 'app/letter.component.html',
                        providers: [collection_service_1.CollectionService]
                    }), 
                    __metadata('design:paramtypes', [collection_service_1.CollectionService, core_service_1.CoreService])
                ], LetterComponent);
                return LetterComponent;
            }());
            exports_1("LetterComponent", LetterComponent);
        }
    }
});
//# sourceMappingURL=letter.component.1.js.map