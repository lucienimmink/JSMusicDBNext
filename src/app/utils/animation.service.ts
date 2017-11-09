import { Injectable } from '@angular/core';

const ANIMATIONDURATION: Number = 0.15 * 1000;

@Injectable()
export class AnimationService {
  requestAnimation(type: string = 'enter', element: Element, reset: boolean = true): void {
    if (element) {
      if (element.classList.contains(type)) {
        element.classList.remove(type);
      }
      setTimeout(function () {
        element.classList.add(type);
      }, 10);
      if (reset) {
        setTimeout(function () {
          element.classList.remove(type);
        }, ANIMATIONDURATION);
      }
    }
  }
}
