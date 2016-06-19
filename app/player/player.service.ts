import { Injectable } from "@angular/core";
import { Subject }    from 'rxjs/Subject';
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';

@Injectable()
export class PlayerService {
    private playlistSource = new Subject<any>();
    private currentPlaylist:any;
    playlistAnnounced$ = this.playlistSource.asObservable();
    private currentTrack:Track;

    constructor() {};

    doPlayAlbum(album:Album, startIndex:number) {
        if (this.currentTrack) {
            this.currentTrack.isPaused = false;
            this.currentTrack.isPlaying = false;
        }
        this.currentPlaylist = {
            playlist: album,
            startIndex: startIndex
        };
        this.announce();
    }
    getCurrentPlaylist() {
        return this.currentPlaylist;
    }
    next() {
        if (this.currentTrack) {
            this.currentTrack.isPaused = false;
            this.currentTrack.isPlaying = false;
        }
        this.currentPlaylist.startIndex++;
        this.announce();
    }
    prev() {
        if (this.currentTrack) {
            this.currentTrack.isPaused = false;
            this.currentTrack.isPlaying = false;
        }
        this.currentPlaylist.startIndex--;
        this.announce();
    }
    announce() {
        this.currentTrack = this.currentPlaylist.playlist.tracks[this.currentPlaylist.startIndex];
        if (this.currentTrack) {
            this.currentTrack.isPaused = false;
            this.currentTrack.isPlaying = true;
            this.playlistSource.next(this.currentPlaylist);
        }
    }
}