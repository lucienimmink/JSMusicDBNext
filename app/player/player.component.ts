import { Component, OnDestroy, ViewChild  } from "@angular/core";
import { PlayerService } from './player.service';
import { Router } from '@angular/router-deprecated';
import { Subscription }   from 'rxjs/Subscription';

import { AlbumArt } from './../utils/albumart.component';

import Track from './../org/arielext/musicdb/models/Track';

@Component({
    templateUrl: 'app/player/player.component.html',
    selector: 'mdb-player',
    directives: [AlbumArt],
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

    @ViewChild(AlbumArt) albumart: AlbumArt;

    constructor(private playerService: PlayerService, private router: Router) {
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
    }
    setTrack() {
        let c = this;
        setTimeout(function () {
            if (c.albumart) c.albumart.ngOnInit();
        });
        this.track = this.playlist.tracks[this.trackIndex];
        this.mediaObject.src = `http://www.arielext.org:16881/listen?path=${this.track.source.url}`;
        if (this.isPlaying) {
            this.mediaObject.play();
        } else {
            this.mediaObject.pause();
        }
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
    }
}