import { Injectable } from "@angular/core";
import { Subject }    from 'rxjs/Subject';
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import * as _ from 'lodash';

@Injectable()
export class PlayerService {
    private playlistSource = new Subject<any>();
    private currentPlaylist:any;
    playlistAnnounced$ = this.playlistSource.asObservable();
    private currentTrack:Track;

    private isPlaying:boolean = false;
    private isPaused:boolean = false;

    constructor() {};

    doPlayAlbum(album:Album, startIndex:number) {
        if (this.currentTrack) {
            this.currentTrack.isPaused = false;
            this.currentTrack.isPlaying = false;
        }
        this.currentPlaylist = {
            playlist: album,
            startIndex: startIndex,
            isPlaying: this.isPlaying = true,
            isPaused: this.isPaused  = false
        };
        localStorage.setItem('current-playlist', this.playlistToString());
        this.announce();
    }
    playlistToString():string {
        let list = [];
        _.each(this.currentPlaylist.playlist.tracks, function (track) {
            if (track) {
                list.push(track.id);
            }
        });
        return JSON.stringify({
            ids: list,
            current: this.currentPlaylist.startIndex
        });
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
    pause() {
        this.isPlaying = false;
        this.isPaused = true;
        this.announce();
    }
    resume() {
        this.isPlaying = true;
        this.isPaused = false;
        this.announce();
    }
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
    }
    announce() {
        this.currentTrack = this.currentPlaylist.playlist.tracks[this.currentPlaylist.startIndex];
        if (this.currentTrack) {
            this.currentTrack.isPaused = this.isPaused;
            this.currentTrack.isPlaying = this.isPlaying;

            this.currentPlaylist.isPlaying = this.isPlaying;
            this.currentPlaylist.isPaused = this.isPaused;

            this.playlistSource.next(this.currentPlaylist);
        }
    }
}