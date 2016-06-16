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
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
var TimeFormatPipe = (function () {
    function TimeFormatPipe() {
    }
    TimeFormatPipe.prototype.transform = function (value) {
        // value is in ms by default
        var ret = '';
        var seconds = Math.floor(value / 1000); // total seconds
        var minutes = Math.floor(seconds / 60); // total minutes
        seconds = seconds % 60; // rest seconds
        var hours = Math.floor(minutes / 60); // total hours
        minutes = minutes % 60; // rest minutes
        if (hours > 0) {
            ret += this.prefixZero(hours) + ":";
        }
        ret += this.prefixZero(minutes) + ":" + this.prefixZero(seconds);
        return ret;
    };
    TimeFormatPipe.prototype.prefixZero = function (num) {
        var s = '';
        if (num < 10) {
            s = '0' + num.toString();
        }
        else {
            s = num.toString();
        }
        return s;
    };
    TimeFormatPipe = __decorate([
        core_1.Pipe({ name: 'timeFormat' }), 
        __metadata('design:paramtypes', [])
    ], TimeFormatPipe);
    return TimeFormatPipe;
}());
exports.TimeFormatPipe = TimeFormatPipe;
//# sourceMappingURL=timeformat.pipe.js.map