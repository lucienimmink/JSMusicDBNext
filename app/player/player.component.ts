import { Component, OnDestroy, ViewChild  } from "@angular/core";
import { PlayerService } from './player.service';
import { Router } from '@angular/router-deprecated';
import { Subscription }   from 'rxjs/Subscription';
import * as _ from 'lodash';

import { AlbumArt } from './../utils/albumart.component';
import Track from './../org/arielext/musicdb/models/Track';
import { LastFMService } from './../lastfm/lastfm.service';
import { CoreService} from './../core.service';
import { musicdbcore} from './../org/arielext/musicdb/core';

@Component({
    templateUrl: 'app/player/player.component.html',
    selector: 'mdb-player',
    directives: [AlbumArt],
    providers: [LastFMService],
    styleUrls: ['app/player/player.component.css']
})
export class PlayerComponent implements OnDestroy {
    private subscription: Subscription;
    private subscription2: Subscription;
    private playlist: any;
    private trackIndex: any;
    private track: Track;
    private currentTrack: Track;
    private showPlayer: boolean = false;
    private isPlaying: boolean = false;
    private isPaused: boolean = false;
    private mediaObject: any;
    private hasScrobbledCurrentTrack: boolean = false;
    private url: string;
    private core: musicdbcore;
    private isCurrentPlaylistLoaded: boolean = false;

    @ViewChild(AlbumArt) albumart: AlbumArt;

    constructor(private playerService: PlayerService, private router: Router, private lastFMService: LastFMService, private coreService: CoreService) {
        this.subscription = this.playerService.playlistAnnounced$.subscribe(
            playerData => {
                this.playlist = playerData.playlist;
                this.trackIndex = playerData.startIndex;
                this.isPaused = playerData.isPaused;
                this.isPlaying = playerData.isPlaying;
                this.showPlayer = true;
                this.setTrack();
            }
        )
        this.mediaObject = new Audio();
        let c = this;
        this.mediaObject.addEventListener('ended', function () {
            c.next();
        })
        this.mediaObject.addEventListener('timeupdate', function () {
            c.updateTime();
        })
        this.mediaObject.addEventListener('play', function () {
            c.onplay();
        })
        let dsm = JSON.parse(localStorage.getItem("jwt"));
        if (dsm) {
            this.url = dsm.dsmport;
        }
        this.core = this.coreService.getCore();
        this.subscription2 = this.core.coreParsed$.subscribe(
            data => {
                let state = localStorage.getItem("save-playlist-state");
                if (state && state === "true") {
                    // read the current playlist on startup
                    this.readCurrentPlaylist();
                }
            }
        )
    }
    setTrack() {
        let c = this;
        setTimeout(function () {
            if (c.albumart) c.albumart.ngOnInit();
        });
        this.track = this.playlist.tracks[this.trackIndex];
        if (this.currentTrack !== this.track) {
            this.mediaObject.src = `${this.url}/listen?path=${encodeURIComponent(this.track.source.url)}`;
            this.currentTrack = this.track;
        }
        if (this.isPlaying) {
            this.mediaObject.play();
        } else {
            this.mediaObject.pause();
        }
        this.hasScrobbledCurrentTrack = false;
        if (this.isCurrentPlaylistLoaded) {
            this.mediaObject.currentTime = localStorage.getItem('current-time') || 0;
            /*
            this.mediaObject.pause();
            this.isPlaying = false;
            this.isPaused = true;
            */
            this.isCurrentPlaylistLoaded = false; // ignore for all next tracks
        }
    }
    readCurrentPlaylist() {
        let current = JSON.parse(localStorage.getItem('current-playlist'));
        if (current) {
            let c = this;
            let core = this.coreService.getCore();
            let list = [];
            _.each(current.ids, function (id) {
                let track = core.tracks[id];
                list.push(track);
            });
            let playlist = {
                tracks: list,
                name: 'Current playlist',
                sortName: 'Current playlist',
                artist: null,
                discs: null,
                year: null,
                art: null,
                url: null
            }
            this.isCurrentPlaylistLoaded = true;
            this.playerService.doPlayAlbum(playlist, current.current);
        }
    }
    ngOnDestroy() {
        this.subscription.unsubscribe(); // prevent memory leakage
        this.subscription2.unsubscribe(); // prevent memory leakage
        this.mediaObject.removeEventListener('ended');
        this.mediaObject.removeEventListener('timeupdate');
        this.mediaObject.removeEventListener('play');
    }
    navigateToArtist() {
        this.router.navigate(['Artist', { letter: this.track.album.artist.letter.escapedLetter, artist: this.track.album.artist.sortName }]);
    }
    navigateToAlbum() {
        this.router.navigate(['Album', { letter: this.track.album.artist.letter.escapedLetter, artist: this.track.album.artist.sortName, album: this.track.album.sortName }]);
    }
    navigateToNowPlaying() {
        this.router.navigate(['NowPlaying']);
    }
    next() {
        if (this.trackIndex < this.playlist.tracks.length - 1) {
            this.trackIndex++;
            this.playerService.next();
        }
    }
    prev() {
        if (this.trackIndex > 0) {
            this.trackIndex--;
            this.playerService.prev();
        }
    }
    togglePlayPause() {
        this.playerService.togglePlayPause();
    }

    updateTime() {
        this.track.position = this.mediaObject.currentTime * 1000;
        if (!this.hasScrobbledCurrentTrack) {
            //TODO: this must be settings; add offline/manual scrobbling
            if (this.track.position >= 4 * 60 * 1000 || this.track.position / this.track.duration >= 0.5) {
                this.hasScrobbledCurrentTrack = true;
                try {
                    this.lastFMService.scrobbleTrack(this.track).subscribe(
                        data => {
                            //console.log('track is scrobbled');
                        }
                    )
                } catch (e) {}
            }
        }
        localStorage.setItem('current-time', this.mediaObject.currentTime.toString());
    }

    onplay() {
        this.lastFMService.announceNowPlaying(this.track).subscribe(
            data => {
                //console.log('announced now playing');
            }
        )
    }
}