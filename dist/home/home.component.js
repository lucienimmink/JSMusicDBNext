System.register(["@angular/core", '@angular/router-deprecated', 'lodash', './../core.service', './../utils/recentlyListened.service'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, _, core_service_1, recentlyListened_service_1;
    var HomeComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (_1) {
                _ = _1;
            },
            function (core_service_1_1) {
                core_service_1 = core_service_1_1;
            },
            function (recentlyListened_service_1_1) {
                recentlyListened_service_1 = recentlyListened_service_1_1;
            }],
        execute: function() {
            HomeComponent = (function () {
                function HomeComponent(coreService, router, recentlyListened) {
                    this.coreService = coreService;
                    this.router = router;
                    this.recentlyListened = recentlyListened;
                    this.recentlyListenedTracks = [];
                }
                HomeComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.core = this.coreService.getCore();
                    this.recentlyListened.getRecentlyListened('arielext').subscribe(function (data) { return _this.populate(data); }, function (error) { return console.log(error); });
                };
                HomeComponent.prototype.setDate = function (track) {
                    if (track["@attr"] && track["@attr"].nowplaying) {
                        return new Date();
                    }
                    else {
                        return new Date(Number(track.date.uts) * 1000);
                    }
                };
                HomeComponent.prototype.setImage = function (track) {
                    // last one is the best possible quality
                    return _.last(track.image)["#text"];
                };
                HomeComponent.prototype.populate = function (json) {
                    var c = this;
                    _.each(json, function (fmtrack) {
                        var track = {
                            artist: fmtrack.artist["#text"],
                            album: fmtrack.album["#text"],
                            title: fmtrack.name,
                            image: c.setImage(fmtrack),
                            nowPlaying: (fmtrack["@attr"] && fmtrack["@attr"].nowplaying) ? true : false,
                            date: c.setDate(fmtrack)
                        };
                        c.recentlyListenedTracks.push(track);
                    });
                };
                HomeComponent.prototype.onSelect = function (album) {
                    this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
                };
                HomeComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/home/home.component.html',
                        selector: 'home',
                        styleUrls: ['app/home/home.component.css'],
                        providers: [recentlyListened_service_1.RecentlyListenedService]
                    }), 
                    __metadata('design:paramtypes', [core_service_1.CoreService, router_deprecated_1.Router, recentlyListened_service_1.RecentlyListenedService])
                ], HomeComponent);
                return HomeComponent;
            }());
            exports_1("HomeComponent", HomeComponent);
            ;
        }
    }
});
//# sourceMappingURL=home.component.js.map