import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { CoreService } from './../core.service';
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import { LastFMService } from './../lastfm/lastfm.service';
import * as _ from 'lodash';
import { Playlist } from './../playlists/Playlist';

@Injectable()
export class PlayerService {
    private playlistSource = new Subject<any>();
    private currentPlaylist: any;
    public playlistAnnounced$ = this.playlistSource.asObservable();
    private currentTrack: Track;

    private isPlaying: boolean = false;
    private isPaused: boolean = false;
    private isShuffled: boolean = false;
    private forceRestart: boolean = false;

    private volume:number = 100;
    private volumeSource = new Subject<any>();
    public volumeAnnounced = this.volumeSource.asObservable();

    private position: number;

    private lastfmUserName: string = localStorage.getItem('lastfm-username'); // should be subscriber?

    private hideVolumeWindowAsSource = new Subject<any>();
    public hideVolumeWindowAnnounced$ = this.hideVolumeWindowAsSource.asObservable();

    constructor(private lastFMService: LastFMService, private coreService: CoreService) { };

    private booleanState(key: string): boolean {
        let raw = localStorage.getItem(key);
        if (raw && raw === 'true') {
            return true;
        }
        return false;
    }

    setPosition(position: number) {
        this.position = position;
        this.announce();
        this.position = null;
    }

    doPlayAlbum(album: Album, startIndex: number, forceRestart:boolean = false, isShuffled: boolean = false) {
        if (this.currentTrack) {
            this.currentTrack.isPaused = false;
            this.currentTrack.isPlaying = false;
        }
        this.setPlaylist(album, startIndex, forceRestart, isShuffled, 'album');
        this.announce();
    }
    doPlayPlaylist(playlist: Playlist, startIndex: number, forceRestart: boolean = false, isShuffled: boolean = false) {
        if (this.currentTrack) {
            this.currentTrack.isPaused = false;
            this.currentTrack.isPlaying = false;
        }
        this.setPlaylist(playlist, startIndex, forceRestart, isShuffled, 'playlist');
        this.announce();
    }

    private setPlaylist(playlist:any, startIndex: number = 0, forceRestart:boolean = true, isShuffled: boolean = false, type:string = "album"):void {
        this.currentPlaylist = {
            playlist: playlist,
            startIndex: startIndex,
            isPlaying: this.isPlaying = true,
            isPaused: this.isPaused = false,
            isShuffled: this.isShuffled = isShuffled,
            forceRestart: this.forceRestart = forceRestart,
            isContinues: playlist.isContinues || type === 'album'
        }
    }

    doPlayTrack(track:Track) {
        if (this.currentTrack) {
            this.currentTrack.isPaused = false;
            this.currentTrack.isPlaying = false;
        }
        let playlist = new Playlist();
        playlist.isOwn = true;
        playlist.name = track.title;
        playlist.tracks.push(track);
        this.currentPlaylist = {
            playlist: playlist,
            startIndex: 0,
            isPlaying: this.isPlaying = true,
            isPaused: this.isPaused = false,
            isShuffled: false,
            forceRestart: this.forceRestart = true,
            isContinues: false
        };
        this.announce();
    }

    nextPlaylist (album:Album): void {
        if (this.booleanState("continues-play")) {
            let nextAlbum = this.coreService.getCore().getNextAlbum(album);
            if (nextAlbum) {
                this.doPlayAlbum(nextAlbum, 0, true, this.isShuffled);
            } else {
                console.warn('no new album found, stopping playback');
                this.stop();
            }
        } else {
            this.stop();
        }
    }
    playlistToString(): string {
        let list: Array<string> = [];
        _.each(this.currentPlaylist.playlist.tracks, function (track: Track) {
            if (track) {
                list.push(track.id);
            }
        });
        return JSON.stringify({
            ids: list,
            isShuffled: this.isShuffled,
            isContinues: this.currentPlaylist.isContinues,
            current: this.currentPlaylist.startIndex
        });
    }
    getCurrentPlaylist() {
        return this.currentPlaylist;
    }
    shufflePlaylist(shuffled: boolean) {
        this.isShuffled = shuffled;
        this.currentPlaylist.playlist.tracks = _.sortBy(this.currentPlaylist.playlist.tracks, ['disc', 'number']);
        if (shuffled) {
            this.currentPlaylist.playlist.tracks = _.shuffle(this.currentPlaylist.playlist.tracks);
        }
        this.currentPlaylist.startIndex = this.currentPlaylist.playlist.tracks.indexOf(this.currentTrack);
        this.currentPlaylist.forceRestart = false;
        this.announce();
    }
    next() {
        if (this.currentTrack) {
            this.currentTrack.isPaused = false;
            this.currentTrack.isPlaying = false;
        }
        if (this.currentPlaylist) {
            this.currentPlaylist.startIndex++;
            if (this.currentPlaylist.startIndex >= this.currentPlaylist.playlist.length) {
                //this.currentPlaylist.startIndex = this.currentPlaylist.playlist.length - 1;
                console.log(this.currentPlaylist);
            }
            this.currentPlaylist.forceRestart = false;
            this.announce();
        }
    }
    prev() {
        if (this.currentTrack) {
            this.currentTrack.isPaused = false;
            this.currentTrack.isPlaying = false;
        }
        if (this.currentPlaylist) {
            this.currentPlaylist.startIndex--;
            if (this.currentPlaylist.startIndex <= 0) {
                this.currentPlaylist.startIndex = 0;
            }
            this.currentPlaylist.forceRestart = false;
            this.announce();
        }
    }
    pause() {
        if (this.currentPlaylist) {
            this.isPlaying = false;
            this.isPaused = true;
            this.currentPlaylist.forceRestart = false;
            this.announce();
        }
    }
    resume() {
        if (this.currentPlaylist) {
            this.isPlaying = true;
            this.isPaused = false;
            this.currentPlaylist.forceRestart = false;
            this.announce();
        }
    }
    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentPlaylist = null;
        localStorage.removeItem('current-playlist');
        localStorage.removeItem('current-time');
        this.playlistSource.next(this.currentPlaylist);
    }
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
    }
    announce() {
        if (this.currentPlaylist) {
            this.currentTrack = this.currentPlaylist.playlist.tracks[this.currentPlaylist.startIndex];
            if (this.lastfmUserName) {
                this.lastFMService.getTrackInfo(this.currentTrack, this.lastfmUserName).subscribe(
                    status => {
                        this.currentTrack.isLoved = status;
                    }
                )
            }
            if (this.currentTrack) {
                this.currentTrack.isPaused = this.isPaused;
                this.currentTrack.isPlaying = this.isPlaying;

                this.currentPlaylist.isPlaying = this.isPlaying;
                this.currentPlaylist.isPaused = this.isPaused;

                this.currentPlaylist.isShuffled = this.isShuffled;

                this.currentPlaylist.position = this.position;

                localStorage.setItem('current-playlist', this.playlistToString());
                this.playlistSource.next(this.currentPlaylist);
            }
        }
    }
    getVolume():number {
        return this.volume;
    }
    setVolume(volume:number):void {
        this.volume = volume;
        this.volumeSource.next(this.volume);
    }
    hideVolumeControl():void {
        this.hideVolumeWindowAsSource.next(true);
    }
}