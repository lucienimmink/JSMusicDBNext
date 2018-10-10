import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class ColorService {
  private colorSource = new Subject<any>();
  color$ = this.colorSource.asObservable();
  setColor(rgba: any): void {
    this.colorSource.next(rgba);
  }
}
