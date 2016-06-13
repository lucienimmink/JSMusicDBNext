import { Injectable } from '@angular/core'
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class PathService {
    private pathAnnouncementSource = new Subject<any>();
    pathAnnounced$ = this.pathAnnouncementSource.asObservable();

    announcePath(path:string) {
        this.pathAnnouncementSource.next(path);
    }
}