import { Component, OnDestroy, ViewChild  } from "@angular/core";
import { PlayerService } from './player.service';
import { Router } from '@angular/router-deprecated';
import { Subscription }   from 'rxjs/Subscription';

import { AlbumArt } from './../utils/albumart.component';
import Track from './../org/arielext/musicdb/models/Track';
import { LastFMService } from './../lastfm/lastfm.service';

@Component({
    templateUrl: 'app/player/player.component.html',
    selector: 'mdb-player',
    directives: [AlbumArt],
    providers: [LastFMService],
    styleUrls: ['app/player/player.component.css']
})
export class PlayerComponent implements OnDestroy {
    private subscription: Subscription;
    private playlist: any;
    private trackIndex: any;
    private track: Track;
    private showPlayer: boolean = false;
    private isPlaying:boolean = false;
    private isPaused:boolean = false;
    private mediaObject:any;
    private hasScrobbledCurrentTrack: boolean = false;
    private url:string = JSON.parse(localStorage.getItem("jwt")).dsmport;

    @ViewChild(AlbumArt) albumart: AlbumArt;

    constructor(private playerService: PlayerService, private router: Router, private lastFMService:LastFMService) {
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
    }
    setTrack() {
        let c = this;
        setTimeout(function () {
            if (c.albumart) c.albumart.ngOnInit();
        });
        this.track = this.playlist.tracks[this.trackIndex];
        this.mediaObject.src = `${this.url}/listen?path=${this.track.source.url}`;
        if (this.isPlaying) {
            this.mediaObject.play();
        } else {
            this.mediaObject.pause();
        }
        this.hasScrobbledCurrentTrack = false;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe(); // prevent memory leakage
        this.mediaObject.removeEventListener('ended');
        this.mediaObject.removeEventListener('timeupdate');
    }
    navigateToArtist() {
        this.router.navigate(['Artist', { letter: this.track.album.artist.letter.escapedLetter, artist: this.track.album.artist.sortName }]);
    }
    navigateToAlbum() {
        this.router.navigate(['Album', { letter: this.track.album.artist.letter.escapedLetter, artist: this.track.album.artist.sortName, album: this.track.album.sortName }]);
    }
    navigateToNowPlaying() {
        this.router.navigate(['Now playing']);
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
                this.lastFMService.scrobbleTrack(this.track).subscribe(
                    data => {
                        //console.log('track is scrobbled');
                    }
                )
            }
        }
    }

    onplay() {
        this.lastFMService.announceNowPlaying(this.track).subscribe(
            data => {
                //console.log('announced now playing');
            }
        )
    }
}