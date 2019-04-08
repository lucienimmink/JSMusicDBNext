import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class PathService {
  public pathAnnounced$ = this.pathAnnouncementSource.asObservable();
  public pageAnnounced$ = this.pageAnnouncementSource.asObservable();
  private pathAnnouncementSource = new Subject<any>();

  private pageAnnouncementSource = new Subject<any>();

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
