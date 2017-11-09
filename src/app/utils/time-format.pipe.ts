import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    let ret = '';
    let seconds = Math.floor(value / 1000); // total seconds
    let minutes = Math.floor(seconds / 60); // total minutes
    seconds = seconds % 60; // rest seconds
    let hours = Math.floor(minutes / 60); // total hours
    minutes = minutes % 60; // rest minutes
    const days = Math.floor(hours / 24); // total days
    hours = hours % 24; // rest hours

    if (days > 0) {
      ret += days + ' days,';
    }
    if (hours > 0) {
      ret += this.prefixZero(hours) + ':';
    }
    ret += this.prefixZero(minutes) + ':' + this.prefixZero(seconds);
    return ret;
  }
  private prefixZero(num: number): string {
    let s = '';
    if (num < 10) {
      s = '0' + num.toString();
    } else {
      s = num.toString();
    }
    return s;
  }
}
