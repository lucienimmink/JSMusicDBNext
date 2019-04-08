import { Injectable } from "@angular/core";

const ANIMATIONDURATION: number = 0.15 * 1000;

@Injectable()
export class AnimationService {
  public requestAnimation(type: string = "enter", element: Element, reset: boolean = true): void {
    if (element) {
      if (element.classList.contains(type)) {
        element.classList.remove(type);
      }
      setTimeout(() => {
        element.classList.add(type);
      }, 10);
      if (reset) {
        setTimeout(() => {
          element.classList.remove(type);
        }, ANIMATIONDURATION);
      }
    }
  }
}
