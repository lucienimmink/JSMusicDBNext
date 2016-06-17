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
var core_1 = require('@angular/core');
var backgroundart_service_1 = require("./backgroundart.service");
var NOIMAGE = 'global/images/no-cover.png';
var BackgroundArtDirective = (function () {
    function BackgroundArtDirective(el, backgroundArtService) {
        this.backgroundArtService = backgroundArtService;
        this.el = el.nativeElement;
    }
    BackgroundArtDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.backgroundArtService.getMediaArt(this.media)
            .subscribe(function (data) { return _this.setImage(data); }, function (error) { return _this.el.style.backgroundImage = "url(" + NOIMAGE + ")"; });
    };
    BackgroundArtDirective.prototype.setImage = function (data) {
        var _this = this;
        if (data === 'global/images/no-cover.png' || data === '') {
            this.backgroundArtService.getMediaArtFromLastFm(this.media).subscribe(function (data) { return _this.el.style.backgroundImage = "url(" + data + ")"; }, function (error) { return _this.el.style.backgroundImage = "url(" + NOIMAGE + ")"; });
        }
        else {
            this.el.style.backgroundImage = "url(" + data + ")";
        }
    };
    __decorate([
        core_1.Input('backgroundArt'), 
        __metadata('design:type', Object)
    ], BackgroundArtDirective.prototype, "media", void 0);
    BackgroundArtDirective = __decorate([
        core_1.Directive({
            selector: '[backgroundArt]',
            providers: [backgroundart_service_1.BackgroundArtService]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, backgroundart_service_1.BackgroundArtService])
    ], BackgroundArtDirective);
    return BackgroundArtDirective;
}());
exports.BackgroundArtDirective = BackgroundArtDirective;
//# sourceMappingURL=backgroundart.directive.js.map