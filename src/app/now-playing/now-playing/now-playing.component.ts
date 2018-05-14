
import {throwError as observableThrowError,  Observable ,  Subscription } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Component, OnDestroy, ViewChild, OnInit, HostListener } from '@angular/core';
import { Http, Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import { PlayerService } from './../../player/player.service';
import { PathService } from './../../utils/path.service';
import { CoreService } from './../../utils/core.service';
import { musicdbcore } from './../../org/arielext/musicdb/core';
import { BackgroundArtDirective } from './../../utils/background-art.directive';
import { TimeFormatPipe } from './../../utils/time-format.pipe';
import { TrackComponent } from './../../track/track/track.component';
import { LastfmService } from './../../utils/lastfm.service';
import { AnimationService } from './../../utils/animation.service';
import Track from './../../org/arielext/musicdb/models/Track';

@Component({
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.css']
})
export class NowPlayingComponent implements OnDestroy, OnInit {

  private subscription: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private playlist: any;
  public track: Track;
  private currentTrack: Track;
  private trackIndex: number;
  private previousTrack = {};
  private slided = false;
  private isPlaying = false;
  private isPaused = false;
  private isShuffled = false;
  private core: musicdbcore;
  private isDragging = false;
  private c: any = this;
  private lastfmusername = '';

  private showVolumeWindow = false;
  private volume = 100;

  private showVisualisation: boolean = this.booleanState('visualisation-state');
  private preferVideo: boolean = this.booleanState('preferVideo-state');
  private smallArt: boolean = this.booleanState('small-art');

  private youtubeSearchBase = 'https://www.googleapis.com/youtube/v3/search';
  private youtubeVideoId: string = null;

  private videoMode = false;
  private player;
  private ytEvent;

  private isEventBound = false;
  private noFocus = false;
  private timeoutTimer: any = null;
  private timeoutTime = 5000;

  @ViewChild(BackgroundArtDirective) albumart: BackgroundArtDirective;

  constructor(private pathService: PathService, private coreService: CoreService, private playerService: PlayerService,
    private router: Router, private lastFMService: LastfmService, private animationService: AnimationService, private http: Http) {
    // this is for when we open the page; just wanting to know the current state of the playerService
    const playerData = this.playerService.getCurrentPlaylist();
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
      // tslint:disable-next-line:no-shadowed-variable
      playerData => {
        this.playlist = playerData.playlist;
        this.trackIndex = playerData.startIndex;
        this.isPaused = playerData.isPaused;
        this.isPlaying = playerData.isPlaying;
        this.isShuffled = playerData.isShuffled;
        this.setTrack();
      }
    );
    this.subscription2 = this.playerService.volumeAnnounced.subscribe(volume => {
      this.volume = volume;
    });
    this.subscription3 = this.playerService.hideVolumeWindowAnnounced$.subscribe(() => {
      this.showVolumeWindow = false;
    });
    this.pathService.announcePage('Now playing');

    if ('ontouchstart' in document.documentElement) {
      document.getElementsByTagName('body')[0].addEventListener('touchmove', this.drag);
      document.getElementsByTagName('body')[0].addEventListener('touchend', this.stopDrag);
    } else {
      document.getElementsByTagName('body')[0].addEventListener('mousemove', this.drag);
      document.getElementsByTagName('body')[0].addEventListener('mouseup', this.stopDrag);
    }

    this.timeoutTimer = setTimeout(() => { this.onTimeout(); }, this.timeoutTime);
  }
  ngOnInit() {
    setTimeout(() => {
      if (this.track) {
        if ('ontouchstart' in document.documentElement) {
          document.getElementById('progress-pusher').addEventListener('touchstart', this.startDrag);
        } else {
          document.getElementById('progress-pusher').addEventListener('mousedown', this.startDrag);
        }
        this.isEventBound = true;
      }
    }, 250);
    this.lastfmusername = localStorage.getItem('lastfm-username') || '';
  }

  private booleanState(key: string): boolean {
    const raw = localStorage.getItem(key);
    if (raw && raw === 'true') {
      return true;
    }
    return false;
  }

  setTrack() {
    setTimeout(() => {
      if (this.albumart) {
        this.albumart.loadImage();
      }
    });
    this.track = this.playlist.tracks[this.trackIndex];

    if (this.currentTrack !== this.track) {
      this.currentTrack = this.track;
      this.animationService.requestAnimation('enter', document.querySelector('.controls-wrapper h4'));
      this.animationService.requestAnimation('enter', document.querySelector('.controls-wrapper h5'));
      this.youtubeVideoId = null; // reset videoid
      this.checkYouTubeForVideo(this.track).subscribe(
        data => {
          // this track has a youtube ID!
          this.youtubeVideoId = data;
          if (this.preferVideo) {
            this.toggleVideo();
          }
        }
      );
    }

    // we need to bind the event to the dragger when it is activated
    if (!this.isEventBound) {
      setTimeout(() => {
        try {
          if ('ontouchstart' in document.documentElement) {
            document.getElementById('progress-pusher').addEventListener('touchstart', this.startDrag);
          } else {
            document.getElementById('progress-pusher').addEventListener('mousedown', this.startDrag);
          }
          this.isEventBound = true;
        } catch (e) { }
      }, 250);
    }
  }
  toggleSlide() {
    this.slided = !this.slided;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // prevent memory leakage
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    if ('ontouchstart' in document.documentElement) {
      document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.drag);
      document.getElementsByTagName('body')[0].removeEventListener('touchend', this.stopDrag);
    } else {
      document.getElementsByTagName('body')[0].removeEventListener('mousemove', this.drag);
      document.getElementsByTagName('body')[0].removeEventListener('mouseup', this.stopDrag);
    }
    clearTimeout(this.timeoutTime);
  }
  navigateToArtist() {
    this.router.navigate(['/letter', this.track.album.artist.letter.escapedLetter, 'artist', this.track.album.artist.sortName]);
  }
  navigateToAlbum() {
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['/letter', this.track.album.artist.letter.escapedLetter, 'artist', this.track.album.artist.sortName, 'album', this.track.album.sortName]);
  }
  next() {
    if (this.videoMode) {
      this.playerService.resume();
    }
    this.videoMode = false;
    setTimeout(() => {
      const previousAlbumArt = <HTMLElement>document.querySelector('.previous-album-art');
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
    });
  }
  prev() {
    if (this.videoMode) {
      this.playerService.resume();
    }
    this.videoMode = false;
    setTimeout(() => {
      const previousAlbumArt = <HTMLElement>document.querySelector('.previous-album-art');
      previousAlbumArt.style.backgroundImage = (<HTMLElement>document.querySelector('.current-album-art')).style.backgroundImage;
      previousAlbumArt.classList.remove('slideRightOut');
      previousAlbumArt.classList.remove('slideLeftOut');
      this.animationService.requestAnimation('slideRightOut', previousAlbumArt, false);
      if (this.trackIndex > 0) {
        this.trackIndex--;
        this.playerService.prev();
      }
    });
  }
  togglePlayPause() {
    if (this.videoMode) {
      if (this.isPlaying) {
        this.player.pauseVideo();
        this.isPlaying = false;
        this.isPaused = true;
      } else {
        this.player.playVideo();
        this.isPlaying = true;
        this.isPaused = false;
      }
    } else {
      this.playerService.togglePlayPause();
    }
  }
  toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    this.playerService.shufflePlaylist(this.isShuffled);
  }
  toggleLoved() {
    this.track.isLoved = !this.track.isLoved;
    this.lastFMService.toggleLoved(this.track).subscribe(
      data => { }
    );
  }
  private startDrag = (e: any) => {
    this.isDragging = true;
  }
  private drag = (e: any) => {
    if (this.isDragging) {
      const clientX = e.clientX || e.changedTouches[0].clientX;
      const left = clientX - 60, perc = (left / document.getElementById('progress-pusher').clientWidth);
      if (perc >= 0 && perc <= 1) {
        this.setIndicatorPosition(perc);
      }
    }
  }
  setIndicatorPosition(perc: number): void {
    document.getElementById('position-indicator').style.marginLeft = (perc * 100) + '%';
  }
  private stopDrag = (e: any) => {
    if (this.isDragging) {
      this.isDragging = false;
      const clientX = e.clientX || e.changedTouches[0].clientX;
      const left = clientX - 60, perc = (left / document.getElementById('progress-pusher').clientWidth);
      const pos = this.track.duration / 1000 * perc;
      this.playerService.setPosition(pos);
    }
  }
  toggleVolumeWindow(e: Event) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
    this.showVolumeWindow = !this.showVolumeWindow;
  }
  setVolume() {
    // this.mediaObject.volume = this.volume / 100;
    this.playerService.setVolume(this.volume);
  }
  round(nr: number) {
    return Math.floor(nr);
  }
  checkYouTubeForVideo(track: Track): Observable<string> {
    const urlSearchParams: URLSearchParams = new URLSearchParams();
    urlSearchParams.set('q', `${track.trackArtist} - ${track.title}`);
    urlSearchParams.set('key', 'AIzaSyDNIncH70uAPgdUK_hZfQ9EQBDPwhuOYmM');
    urlSearchParams.set('part', 'id');
    const query: RequestOptionsArgs = {
      search: urlSearchParams
    };
    return this.http.get(this.youtubeSearchBase, query).pipe(
      map(this.extractData),
      catchError(this.handleError),);
  }
  extractData(res: Response): string {
    const json = res.json();
    const videoid = null;
    if (json && json.items) {
      return json.items[0].id.videoId;
    }
    return videoid;
  }
  handleError(error: Response) {
    return observableThrowError(`no video`);
  }
  toggleVideo(): void {
    this.videoMode = !this.videoMode;
    if (this.videoMode) {
      this.playerService.pause();
    } else {
      this.playerService.togglePlayPause();
    }
  }
  savePlayer(player) {
    this.player = player;
    this.player.playVideo();
    this.isPlaying = true;
    this.isPaused = false;
  }
  onStateChange(event) {
    if (event.data === 0) {
      // stopped
      this.videoMode = false;
      this.next();
    }
  }

  onTimeout() {
    if (!this.slided && !this.videoMode) {
      this.noFocus = true;
    }
  }

  @HostListener('mousemove', ['$event'])
  onMove(e): void {
    clearTimeout(this.timeoutTimer);
    this.noFocus = false;
    this.timeoutTimer = setTimeout(() => { this.onTimeout(); }, this.timeoutTime);
  }
}
