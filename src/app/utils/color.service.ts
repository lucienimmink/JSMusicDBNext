import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class ColorService {
  public color$ = this.colorSource.asObservable();
  public blob$ = this.blobSource.asObservable();
  private colorSource = new Subject<any>();

  private blobSource = new Subject<boolean>();

  public setColor(rgba: any): void {
    this.colorSource.next(rgba);
  }

  public setBlob(): void {
    this.blobSource.next(true);
  }
}
