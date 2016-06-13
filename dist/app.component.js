System.register(["@angular/core", '@angular/router-deprecated', './collection.service', './core.service', './letter/letter.component', './letter/letterdetail.component', './artist/artistdetail.component', './album/albumdetail.component', './menu/topmenu.component', './utils/path.service', './rxjs-operators'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, collection_service_1, core_service_1, letter_component_1, letterdetail_component_1, artistdetail_component_1, albumdetail_component_1, topmenu_component_1, path_service_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (collection_service_1_1) {
                collection_service_1 = collection_service_1_1;
            },
            function (core_service_1_1) {
                core_service_1 = core_service_1_1;
            },
            function (letter_component_1_1) {
                letter_component_1 = letter_component_1_1;
            },
            function (letterdetail_component_1_1) {
                letterdetail_component_1 = letterdetail_component_1_1;
            },
            function (artistdetail_component_1_1) {
                artistdetail_component_1 = artistdetail_component_1_1;
            },
            function (albumdetail_component_1_1) {
                albumdetail_component_1 = albumdetail_component_1_1;
            },
            function (topmenu_component_1_1) {
                topmenu_component_1 = topmenu_component_1_1;
            },
            function (path_service_1_1) {
                path_service_1 = path_service_1_1;
            },
            function (_1) {}],
        execute: function() {
            AppComponent = (function () {
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
                        providers: [collection_service_1.CollectionService, core_service_1.CoreService, path_service_1.PathService],
                        directives: [letter_component_1.LetterComponent, router_deprecated_1.ROUTER_DIRECTIVES, topmenu_component_1.TopMenuComponent]
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
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map