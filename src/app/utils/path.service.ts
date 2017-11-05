import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PathService {
  private pathAnnouncementSource = new Subject<any>();
  pathAnnounced$ = this.pathAnnouncementSource.asObservable();

  private pageAnnouncementSource = new Subject<any>();
  pageAnnounced$ = this.pageAnnouncementSource.asObservable();

  announcePath(path: any) {
    this.pathAnnouncementSource.next(path);
  }
  announcePage(page: any, letter: any = null) {
    this.pageAnnouncementSource.next({
      page: page,
      letter: letter
    });
  }
}
