import { Component, OnInit, ViewChild, OnDestroy, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { musicdbcore } from './org/arielext/musicdb/core';
import { CollectionService } from './utils/collection.service';
import { CoreService } from './utils/core.service';
import { PathService } from './utils/path.service';
import { PlayerService } from './player/player.service';
import { PlaylistService } from './playlist/playlist.service';
import { LastfmService } from './utils/lastfm.service';
import { LoginService } from './login/login.service';
import { AnimationService } from './utils/animation.service';
import { ConfigService } from './utils/config.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mdb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CollectionService, CoreService, PathService, PlayerService, LastfmService, AnimationService, ConfigService, PlaylistService]
})
export class AppComponent implements OnInit, OnDestroy {
  private letter = 'N';
  private artists: Array<any>;
  private subscription: Subscription;
  private path = 'JSMusicDB Next';
  private isLoading = false;
  private viewContainerRef: ViewContainerRef;
  public isPlaying = false;
  private mediaObject: any;
  private isFlacSupported: boolean;
  // tslint:disable-next-line:max-line-length
  constructor(private collectionService: CollectionService, private coreService: CoreService, private loginService: LoginService, private configService: ConfigService, private playerService: PlayerService, viewContainerRef: ViewContainerRef) {

    if (this.loginService.hasToken) {
      this.isLoading = true;
      this.getCollection();
    }
    this.configService.applyTheme();
    this.viewContainerRef = viewContainerRef;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.onmessage = (evt) => {
        const message = JSON.parse(evt.data);
        if (message.type === 'refresh') {
          window.caches.open('v1').then((cache) => {
            return cache.match(message.url);
          }).then((response) => {
            return response.json();
          }).then((data) => {
            this.coreService.getCore().resetCollection();
            this.fillCollection(data);
          });
        }
      };
    }
    this.subscription = this.playerService.playlistAnnounced$.subscribe(
      playerData => {
        this.isPlaying = (playerData) ? true : false; // stopped playlist return a null
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.mediaObject = document.querySelector('audio');
    const canPlayType = this.mediaObject.canPlayType('audio/flac');
    this.isFlacSupported = (canPlayType === 'probably' || canPlayType === 'maybe');
  }

  getCollection() {
    this.collectionService.getCollection()
      .subscribe(
      data => this.fillCollection(data),
      error => console.log(error)
      );
  }
  fillCollection(data: any): void {
    localStorage.setItem('lastParsed', new Date().getTime().toString());
    this.coreService.getCore().parseSourceJson(data, this.isFlacSupported);
    this.isLoading = false;
  }
  hideVolumeWindow(): void {
    this.playerService.hideVolumeControl();
  }

  onExternalPrev(event: Event): void {
    this.playerService.prev();
  }
  onExternalNext(event: Event): void {
    this.playerService.next();
  }
  onExternalToggle(event: Event): void {
    this.playerService.togglePlayPause();
  }
  onExternalStop(event: Event): void {
    this.playerService.stop();
  }
}
