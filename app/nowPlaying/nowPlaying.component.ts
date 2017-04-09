import { Component, OnDestroy, ViewChild, OnInit } from "@angular/core";
import { PlayerService } from './../player/player.service';
import { PathService } from './../utils/path.service';
import { CoreService } from './../core.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { TimeFormatPipe } from './../timeformat.pipe';
import { Subscription }   from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { TrackListComponent } from './../track/tracklist.component';
import { LastFMService } from './../lastfm/lastfm.service';
import Track from './../org/arielext/musicdb/models/Track';
import { AnimationService } from './../utils/animation.service';

@Component({
    templateUrl: 'app/nowPlaying/nowPlaying.component.html',
    styleUrls: ['dist/nowPlaying/nowPlaying.component.css']
})
export class NowPlayingComponent implements OnDestroy, OnInit {

    private subscription: Subscription;
    private subscription2: Subscription;
    private playlist:any;
    private track:Track;
    private currentTrack: Track;
    private trackIndex:number;
    private previousTrack = {};
    private slided: boolean = false;
    private isPlaying: boolean = false;
    private isPaused: boolean = false;
    private isShuffled: boolean = false;
    private core: musicdbcore;
    private isDragging:boolean = false;
    private c:any = this;

    private showVolumeWindow: boolean = false;
    private volume:number = 100;

    private showVisualisation: boolean = this.booleanState('visualisation-state');

    @ViewChild(BackgroundArtDirective) albumart: BackgroundArtDirective;

    constructor(private pathService: PathService, private coreService: CoreService, private playerService: PlayerService, private router: Router, private lastFMService:LastFMService, private animationService:AnimationService) {
        // this is for when we open the page; just wanting to know the current state of the playerService
        let playerData = this.playerService.getCurrentPlaylist();
        if (playerData) {
            this.playlist = playerData.playlist;
            this.trackIndex = playerData.startIndex;
            this.isPaused = playerData.isPaused;
            this.isPlaying = playerData.isPlaying;
            this.isShuffled = playerData.isShuffled;
            this.volume = this.playerService.getVolume();
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
        this.subscription2 = this.playerService.volumeAnnounced.subscribe(volume => {
            this.volume = volume;
        })
        this.pathService.announcePage('Now playing');

        if ('ontouchstart' in document.documentElement) {
            document.getElementsByTagName('body')[0].addEventListener('touchmove', this.drag);
            document.getElementsByTagName('body')[0].addEventListener('touchend', this.stopDrag);
        } else {
            document.getElementsByTagName('body')[0].addEventListener('mousemove', this.drag);
            document.getElementsByTagName('body')[0].addEventListener('mouseup', this.stopDrag);
        }
        
    }
    ngOnInit() {
        let c = this;
        setTimeout(function () {
            try {
                if ('ontouchstart' in document.documentElement) {

                    document.getElementById('progress-pusher').addEventListener('touchstart', c.startDrag);
                } else {
                    document.getElementById('progress-pusher').addEventListener('mousedown', c.startDrag);
                }
            } catch (e) {}
        }, 250);
    }

    private booleanState(key: string): boolean {
        let raw = localStorage.getItem(key);
        if (raw && raw === 'true') {
            return true;
        }
        return false;
    }

    setTrack() {
        let c = this;
        setTimeout(function () {
            if (c.albumart) c.albumart.loadImage();
        });
        this.track = this.playlist.tracks[this.trackIndex];

        if (this.currentTrack !== this.track) {
            this.currentTrack = this.track;
            this.animationService.requestAnimation('enter', document.querySelector('.controls-wrapper h4'));
            this.animationService.requestAnimation('enter', document.querySelector('.controls-wrapper h5'));
        }
    }
    toggleSlide() {
        this.slided = !this.slided;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe(); // prevent memory leakage
        this.subscription2.unsubscribe();
        if ('ontouchstart' in document.documentElement) {
            document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.drag);
            document.getElementsByTagName('body')[0].removeEventListener('touchend', this.stopDrag);
        } else {
            document.getElementsByTagName('body')[0].removeEventListener('mousemove', this.drag);
            document.getElementsByTagName('body')[0].removeEventListener('mouseup', this.stopDrag);
        }
    }
    navigateToArtist() {
        //this.router.navigate(['Artist', { letter: this.track.album.artist.letter.escapedLetter, artist: this.track.album.artist.sortName }]);
        this.router.navigate(['/letter',this.track.album.artist.letter.escapedLetter, 'artist', this.track.album.artist.sortName ]);
    }
    navigateToAlbum() {
        // this.router.navigate(['Album', { letter: this.track.album.artist.letter.escapedLetter, artist: this.track.album.artist.sortName, album: this.track.album.sortName }]);
        this.router.navigate(['/letter',this.track.album.artist.letter.escapedLetter, 'artist', this.track.album.artist.sortName, 'album', this.track.album.sortName ]);
    }
    next() {
        let previousAlbumArt = <HTMLElement>document.querySelector('.previous-album-art');
        previousAlbumArt.style.backgroundImage = (<HTMLElement>document.querySelector('.current-album-art')).style.backgroundImage;
        previousAlbumArt.classList.remove('slideRightOut');
        previousAlbumArt.classList.remove('slideLeftOut');
        this.animationService.requestAnimation('slideLeftOut', previousAlbumArt, false);
        if (this.trackIndex < this.playlist.tracks.length - 1) {
            this.trackIndex++;
            this.playerService.next();
        } else {
            if (this.playlist.isContinues) {
                // generate a new playlist and start playing that one
                this.trackIndex = 0;
                if (this.playlist.type === 'random' || this.playlist.type === 'radio') {
                    this.playerService.nextPlaylist(this.playlist.type);
                } else {
                    this.playerService.nextAlbum(this.track.album);
                }
            } else {
                this.playerService.stop();
            }
        }
    }
    prev() {
        let previousAlbumArt = <HTMLElement>document.querySelector('.previous-album-art');
        previousAlbumArt.style.backgroundImage = (<HTMLElement>document.querySelector('.current-album-art')).style.backgroundImage;
        previousAlbumArt.classList.remove('slideRightOut');
        previousAlbumArt.classList.remove('slideLeftOut');
        this.animationService.requestAnimation('slideRightOut', previousAlbumArt, false);
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
    private startDrag = (e:any) => {
        this.isDragging = true;
    }
    private drag = (e:any) => {
        if (this.isDragging) {
            let clientX = e.clientX || e.changedTouches[0].clientX;
            let left = clientX - 60, perc = (left / document.getElementById('progress-pusher').clientWidth);
            if (perc >= 0 && perc <= 1) {
                this.setIndicatorPosition(perc);
            }
        }
    }
    setIndicatorPosition(perc:number):void {
        document.getElementById('position-indicator').style.marginLeft = (perc * 100) + '%';
    }
    private stopDrag = (e:any) => {
        if (this.isDragging) {
            this.isDragging = false;
            let clientX = e.clientX || e.changedTouches[0].clientX;
            let left = clientX - 60, perc = (left / document.getElementById('progress-pusher').clientWidth);
            let pos = this.track.duration / 1000 * perc;
            this.playerService.setPosition(pos);
        }
    }
    toggleVolumeWindow() {
        this.showVolumeWindow = !this.showVolumeWindow;
    }
    setVolume() {
        //this.mediaObject.volume = this.volume / 100;
        this.playerService.setVolume(this.volume);
    }
    round(nr:number) {
        return Math.floor(nr);
    }
}