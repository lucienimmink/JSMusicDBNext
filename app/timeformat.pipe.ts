import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({name: 'timeFormat'})
export class TimeFormatPipe implements PipeTransform {
  transform(value: number): string {
    // value is in ms by default
    let ret = '';
    let seconds = Math.floor(value / 1000); // total seconds
    let minutes = Math.floor(seconds / 60); // total minutes
    seconds = seconds % 60; // rest seconds
    let hours = Math.floor(minutes / 60); // total hours
    minutes = minutes % 60; // rest minutes
    if (hours > 0) {
        ret+= this.prefixZero(hours) + ":";
    }
    ret+= this.prefixZero(minutes) + ":" + this.prefixZero(seconds);
    return ret;
  }
  private prefixZero(num:number):string {
      let s = '';
      if (num < 10) {
          s = '0' + num.toString();
      } else {
          s = num.toString();
      }
      return s;
  }
}