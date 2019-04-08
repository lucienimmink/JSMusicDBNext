import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class PathService {
  public pathAnnouncementSource = new Subject<any>();
  public pageAnnouncementSource = new Subject<any>();
  public pathAnnounced$ = this.pathAnnouncementSource.asObservable();
  public pageAnnounced$ = this.pageAnnouncementSource.asObservable();

  public announcePath(path: any) {
    this.pathAnnouncementSource.next(path);
  }
  public announcePage(page: any, letter: any = null) {
    this.pageAnnouncementSource.next({
      page,
      letter
    });
  }
}
