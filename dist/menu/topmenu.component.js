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
var path_service_1 = require("./../utils/path.service");
var TopMenuComponent = (function () {
    function TopMenuComponent(pathService) {
        var _this = this;
        // subscribe to a change in path; so we can display it
        this.subscription = pathService.pathAnnounced$.subscribe(function (path) {
            _this.path = path;
        });
    }
    TopMenuComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe(); // prevent memory leakage
    };
    TopMenuComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/menu/topmenu.component.html',
            selector: 'topmenu',
            styleUrls: ['app/menu/topmenu.component.css']
        }), 
        __metadata('design:paramtypes', [path_service_1.PathService])
    ], TopMenuComponent);
    return TopMenuComponent;
}());
exports.TopMenuComponent = TopMenuComponent;
//# sourceMappingURL=topmenu.component.js.map