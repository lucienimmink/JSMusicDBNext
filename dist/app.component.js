System.register(["@angular/core", './org/arielext/musicdb/core', './collection.service', './rxjs-operators'], function(exports_1, context_1) {
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
    var core_1, core_2, collection_service_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (collection_service_1_1) {
                collection_service_1 = collection_service_1_1;
            },
            function (_1) {}],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(collectionService) {
                    this.collectionService = collectionService;
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
                    var core = new core_2.musicdbcore();
                    core.parseSourceJson(data);
                    var lettersObject = core.letters;
                    var sorted = Object.keys(lettersObject).sort(function (a, b) {
                        return (a < b) ? -1 : 1;
                    });
                    var t = [];
                    sorted.forEach(function (value, index) {
                        t.push(lettersObject[value]);
                    });
                    this.letters = t;
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'musicdb',
                        templateUrl: 'app/app.component.html',
                        providers: [collection_service_1.CollectionService]
                    }), 
                    __metadata('design:paramtypes', [collection_service_1.CollectionService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map