import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class ColorService {
  public colorSource = new Subject<any>();
  public blobSource = new Subject<boolean>();
  public color$ = this.colorSource.asObservable();
  public blob$ = this.blobSource.asObservable();

  public setColor(rgba: any): void {
    this.colorSource.next(rgba);
  }

  public setBlob(): void {
    this.blobSource.next(true);
  }
}
