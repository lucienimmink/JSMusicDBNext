import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class ColorService {
  private colorSource = new Subject<any>();
  color$ = this.colorSource.asObservable();

  private blobSource = new Subject<boolean>();
  blob$ = this.blobSource.asObservable();

  setColor(rgba: any): void {
    this.colorSource.next(rgba);
  }

  setBlob(): void {
    this.blobSource.next(true);
  }
}
