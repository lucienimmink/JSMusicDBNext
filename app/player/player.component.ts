import { Component, OnDestroy, ViewChild  } from "@angular/core";
import { PlayerService } from './player.service';
import { Router } from '@angular/router-deprecated';
import { Subscription }   from 'rxjs/Subscription';

import { AlbumArt } from './../utils/albumart.component';

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
    private track: any;
    private showPlayer: boolean = false;

    @ViewChild(AlbumArt) albumart: AlbumArt;

    constructor(private playerService: PlayerService, private router: Router) {
        this.subscription = this.playerService.playlistAnnounced$.subscribe(
            playerData => {
                this.playlist = playerData.playlist;
                this.trackIndex = playerData.startIndex;
                this.showPlayer = true;
                this.setTrack();
            }
        )
    }
    setTrack() {
        let c = this;
        setTimeout(function () {
            if (c.albumart) c.albumart.ngOnInit();
        });
        this.track = this.playlist.tracks[this.trackIndex];
    }

    ngOnDestroy() {
        this.subscription.unsubscribe(); // prevent memory leakage
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
        if (this.trackIndex <= this.playlist.tracks.length - 1) {
            this.trackIndex++;
            this.playerService.doPlayAlbum(this.playlist, this.trackIndex);
        }
    }
    prev() {
        if (this.trackIndex > 0) {
            this.trackIndex--;
            this.playerService.doPlayAlbum(this.playlist, this.trackIndex);
        }
    }
}