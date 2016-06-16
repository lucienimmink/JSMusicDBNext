import { Injectable } from "@angular/core";
import { Subject }    from 'rxjs/Subject';
import Album from './../org/arielext/musicdb/models/Album';

@Injectable()
export class PlayerService {
    private playlistSource = new Subject<any>();
    playlistAnnounced$ = this.playlistSource.asObservable();
    constructor() {};

    doPlayAlbum(album:Album, startIndex:number) {
        console.log('go start play album', album, 'start at track', startIndex);
        this.playlistSource.next({
            playlist: album,
            startIndex: startIndex
        });
    }
}