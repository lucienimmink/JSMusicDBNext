import { Injectable } from "@angular/core";
import { Subject }    from 'rxjs/Subject';
import Album from './../org/arielext/musicdb/models/Album';

@Injectable()
export class PlayerService {
    private playlistSource = new Subject<any>();
    private currentPlaylist:any;
    playlistAnnounced$ = this.playlistSource.asObservable();
    constructor() {};

    doPlayAlbum(album:Album, startIndex:number) {
        this.currentPlaylist = {
            playlist: album,
            startIndex: startIndex
        };
        this.playlistSource.next(this.currentPlaylist);
    }
    getCurrentPlaylist() {
        return this.currentPlaylist;
    }
}