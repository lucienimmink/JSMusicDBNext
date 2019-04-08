declare const Windows: any;

import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { tinycolor } from "@thebespokepixel/es-tinycolor";
import { get, set } from "idb-keyval";
import { Observable, Subscription } from "rxjs";

import { LoginService } from "./login/login.service";
import { musicdbcore } from "./org/arielext/musicdb/core";
import { PlayerService } from "./player/player.service";
import { PlaylistService } from "./playlist/playlist.service";
import { AnimationService } from "./utils/animation.service";
import { CollectionService } from "./utils/collection.service";
import { ColorService } from "./utils/color.service";
import { ConfigService } from "./utils/config.service";
import { CoreService } from "./utils/core.service";
import { LastfmService } from "./utils/lastfm.service";
import { PathService } from "./utils/path.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "mdb-root",
  templateUrl: "./app.component.html",
  providers: [CollectionService, CoreService, PathService, PlayerService, LastfmService, AnimationService, ConfigService, PlaylistService, ColorService]
})
export class AppComponent implements OnInit, OnDestroy {
  public isPlaying = false;
  public scanperc = 0;
  public isReloading = false;
  private letter = "N";
  private artists: any[];
  private subscription: Subscription;
  private path = "JSMusicDB Next";
  private isLoading = false;
  private viewContainerRef: ViewContainerRef;
  private mediaObject: any;
  private isFlacSupported: boolean;
  private hasBeenReloading = false;
  private isHostedApp: boolean = typeof Windows !== "undefined";
  // tslint:disable-next-line:max-line-length
  constructor(
    private collectionService: CollectionService,
    private coreService: CoreService,
    private loginService: LoginService,
    private configService: ConfigService,
    private playerService: PlayerService,
    private colorService: ColorService,
    viewContainerRef: ViewContainerRef
  ) {
    if (this.loginService.hasToken) {
      this.isLoading = true;
      this.poll();
    }
    this.viewContainerRef = viewContainerRef;

    this.subscription = this.playerService.playlistAnnounced$.subscribe(playerData => {
      this.isPlaying = playerData ? true : false; // stopped playlist return a null
    });
    if (this.booleanState("tracking-state")) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.configService.getSunriseInfo(pos.coords.latitude, pos.coords.longitude).subscribe(data => {
            // set this info back in the service
            this.configService.startDate = new Date(data.results.sunset);
            this.configService.stopDate = new Date(data.results.sunrise);
            this.configService.stopDate.setDate(this.configService.stopDate.getDate() + 1);
            this.configService.geoSource.next();
            this.configService.applyTheme();
          });
        },
        err => {
          this.configService.startDate = new Date();
          this.configService.startDate.setHours(21, 0, 0);

          this.configService.stopDate = new Date();
          this.configService.stopDate.setDate(this.configService.stopDate.getDate() + 1);
          this.configService.stopDate.setHours(7, 0, 0);
          this.configService.geoSource.next();
          this.configService.applyTheme();
        }
      );
    } else {
      this.configService.startDate = new Date();
      this.configService.startDate.setHours(21, 0, 0);

      this.configService.stopDate = new Date();
      this.configService.stopDate.setDate(this.configService.stopDate.getDate() + 1);
      this.configService.stopDate.setHours(7, 0, 0);
      this.configService.geoSource.next();
      this.configService.applyTheme();
    }
  }
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  public ngOnInit() {
    this.mediaObject = document.querySelector("audio");
    const canPlayType = this.mediaObject.canPlayType("audio/flac");
    this.isFlacSupported = canPlayType === "probably" || canPlayType === "maybe";
  }

  public getCollection() {
    this.collectionService.getCollection().subscribe(data => this.fillCollection(data), error => console.error(error));
  }
  public fillCollection(data: any): void {
    localStorage.setItem("lastParsed", new Date().getTime().toString());
    this.coreService.getCore().parseSourceJson(data, this.isFlacSupported);
    this.isLoading = false;
  }
  public hideVolumeWindow(): void {
    this.playerService.hideVolumeControl();
  }

  public poll() {
    this.collectionService.poll().subscribe(data => {
      this.scanperc = data.progress;
      if (data.status !== "ready") {
        this.isReloading = true;
        document.querySelector("mdb-player").dispatchEvent(
          new CustomEvent("external.mdbscanning", {
            detail: { percentage: this.scanperc }
          })
        );
        setTimeout(e => {
          this.poll();
        }, 5000);
        this.hasBeenReloading = true;
      } else {
        this.isReloading = false;
        if (this.hasBeenReloading) {
          document.querySelector("mdb-player").dispatchEvent(new CustomEvent("external.mdbscanstop"));
        }
        this.getCollection();
      }
    });
  }

  public onExternalPrev(event: Event): void {
    this.playerService.prev();
  }
  public onExternalNext(event: Event): void {
    this.playerService.next();
  }
  public onExternalToggle(event: Event): void {
    this.playerService.togglePlayPause();
  }
  public onExternalStop(event: Event): void {
    this.playerService.stop();
  }
  public onExternalBlob(): void {
    // we received a blob; tell the colorserivce to do it's magic with it
    this.colorService.setBlob();
  }

  private booleanState(key: string): boolean {
    const raw = localStorage.getItem(key);
    if (raw && raw === "true") {
      return true;
    }
    return false;
  }
}
