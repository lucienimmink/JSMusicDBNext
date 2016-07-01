import { Component, OnDestroy, ViewChild, OnInit } from "@angular/core";
import { PlayerService } from './../player/player.service';
import { PathService } from './../utils/path.service';
import { CoreService } from './../core.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { TimeFormatPipe } from './../timeformat.pipe';
import { Subscription }   from 'rxjs/Subscription';
import { Router } from '@angular/router-deprecated';
import { TrackListComponent } from './../track/tracklist.component';
import { LastFMService } from './../lastfm/lastfm.service';
import Track from './../org/arielext/musicdb/models/Track';

@Component({
    templateUrl: 'app/nowPlaying/nowPlaying.component.html',
    pipes: [TimeFormatPipe],
    directives: [BackgroundArtDirective, TrackListComponent],
    styleUrls: ['app/nowPlaying/nowPlaying.component.css']
})
export class NowPlayingComponent implements OnDestroy, OnInit {

    private subscription: Subscription;
    private playlist;
    private track:Track;
    private trackIndex;
    private previousTrack = {};
    private slided: boolean = false;
    private isPlaying: boolean = false;
    private isPaused: boolean = false;
    private isShuffled: boolean = false;
    private core: musicdbcore;
    private isDragging:boolean = false;
    private c:any = this;

    @ViewChild(BackgroundArtDirective) albumart: BackgroundArtDirective;

    constructor(private pathService: PathService, private coreService: CoreService, private playerService: PlayerService, private router: Router, private lastFMService:LastFMService) {
        // this is for when we open the page; just wanting to know the current state of the playerService
        let playerData = this.playerService.getCurrentPlaylist();
        if (playerData) {
            this.playlist = playerData.playlist;
            this.trackIndex = playerData.startIndex;
            this.isPaused = playerData.isPaused;
            this.isPlaying = playerData.isPlaying;
            this.isShuffled = playerData.isShuffled;
            this.setTrack();
        }
        // this is for when a new track is announced while we are already on the page
        this.subscription = this.playerService.playlistAnnounced$.subscribe(
            playerData => {
                this.playlist = playerData.playlist;
                this.trackIndex = playerData.startIndex;
                this.isPaused = playerData.isPaused;
                this.isPlaying = playerData.isPlaying;
                this.isShuffled = playerData.isShuffled;
                this.setTrack();
            }
        )
        this.pathService.announcePage('Now playing');

        document.getElementsByTagName('body')[0].addEventListener('mousemove', this.drag);
        document.getElementsByTagName('body')[0].addEventListener('mouseup', this.stopDrag);
    }
    ngOnInit() {
        let c = this;
        setTimeout(function () {
            document.getElementById('progress-pusher').addEventListener('mousedown', c.startDrag);
        }, 100);
    }
    setTrack() {
        let c = this;
        setTimeout(function () {
            if (c.albumart) c.albumart.loadImage();
        });
        this.track = this.playlist.tracks[this.trackIndex];
        this.track.position = 0;
    }
    toggleSlide() {
        this.slided = !this.slided;
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
    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.playerService.shufflePlaylist(this.isShuffled);
    }
    toggleLoved() {
        this.track.isLoved = !this.track.isLoved;
        this.lastFMService.toggleLoved(this.track).subscribe(
            data => { }
        )
    }
    private startDrag = (e:MouseEvent) => {
        this.isDragging = true;
    }
    private drag = (e:MouseEvent) => {
        if (this.isDragging) {
            let clientX = e.clientX;
            let left = clientX - 60, perc = (left / document.getElementById('progress-pusher').clientWidth);
            if (perc >= 0 && perc <= 1) {
                this.setIndicatorPosition(perc);
            }
        }
    }
    setIndicatorPosition(perc:number):void {
        document.getElementById('position-indicator').style.marginLeft = (perc * 100) + '%';
    }
    private stopDrag = (e:MouseEvent) => {
        if (this.isDragging) {
            this.isDragging = false;
            let clientX = e.clientX;
            let left = clientX - 60, perc = (left / document.getElementById('progress-pusher').clientWidth);
            let pos = this.track.duration / 1000 * perc;
            this.playerService.setPosition(pos);
        }
    }
}