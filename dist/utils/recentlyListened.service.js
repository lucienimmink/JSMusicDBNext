System.register(["@angular/core", "@angular/http", "rxjs/Observable"], function(exports_1, context_1) {
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
    var core_1, http_1, Observable_1;
    var RecentlyListenedService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            }],
        execute: function() {
            RecentlyListenedService = (function () {
                function RecentlyListenedService(http) {
                    this.http = http;
                }
                RecentlyListenedService.prototype.getRecentlyListened = function (user) {
                    var urlSearchParams = new http_1.URLSearchParams();
                    urlSearchParams.set('user', user);
                    urlSearchParams.set('method', 'user.getrecenttracks');
                    urlSearchParams.set('api_key', '956c1818ded606576d6941de5ff793a5');
                    urlSearchParams.set('format', 'json');
                    urlSearchParams.set('limit', '10');
                    var query = {
                        search: urlSearchParams
                    };
                    return this.http.get('//ws.audioscrobbler.com/2.0/', query)
                        .map(this.extractData)
                        .catch(this.handleError);
                };
                RecentlyListenedService.prototype.extractData = function (res) {
                    var json = res.json();
                    if (json.recenttracks) {
                        return json.recenttracks.track;
                    }
                    return null;
                };
                RecentlyListenedService.prototype.handleError = function (error) {
                    var errorMessage = (error.message) ? error.message : (error.status) ? error.status + " - " + error.statusText : 'Server error';
                    return Observable_1.Observable.throw(errorMessage);
                };
                RecentlyListenedService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], RecentlyListenedService);
                return RecentlyListenedService;
            }());
            exports_1("RecentlyListenedService", RecentlyListenedService);
        }
    }
});
//# sourceMappingURL=recentlyListened.service.js.map