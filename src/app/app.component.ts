declare const Windows: any;

import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ViewContainerRef
} from "@angular/core";
import { get, set } from "idb-keyval";
import { Observable, Subscription } from "rxjs";
import { tinycolor } from "@thebespokepixel/es-tinycolor";

import { musicdbcore } from "./org/arielext/musicdb/core";
import { CollectionService } from "./utils/collection.service";
import { CoreService } from "./utils/core.service";
import { PathService } from "./utils/path.service";
import { PlayerService } from "./player/player.service";
import { PlaylistService } from "./playlist/playlist.service";
import { LastfmService } from "./utils/lastfm.service";
import { LoginService } from "./login/login.service";
import { AnimationService } from "./utils/animation.service";
import { ConfigService } from "./utils/config.service";
import {
  getColorsFromRGB,
  addCustomCss,
  getAccentColor
} from "./utils/colorutil";
import { ColorService } from "./utils/color.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "mdb-root",
  templateUrl: "./app.component.html",
  providers: [
    CollectionService,
    CoreService,
    PathService,
    PlayerService,
    LastfmService,
    AnimationService,
    ConfigService,
    PlaylistService,
    ColorService
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  private letter = "N";
  private artists: Array<any>;
  private subscription: Subscription;
  private path = "JSMusicDB Next";
  private isLoading = false;
  private viewContainerRef: ViewContainerRef;
  public isPlaying = false;
  private mediaObject: any;
  private isFlacSupported: boolean;
  public scanperc = 0;
  public isReloading = false;
  private hasBeenReloading = false;
  private isHostedApp: boolean = typeof Windows !== "undefined";
  // tslint:disable-next-line:max-line-length
  constructor(
    private collectionService: CollectionService,
    private coreService: CoreService,
    private loginService: LoginService,
    private configService: ConfigService,
    private playerService: PlayerService,
    viewContainerRef: ViewContainerRef
  ) {
    if (this.loginService.hasToken) {
      this.isLoading = true;
      this.poll();
    }
    this.viewContainerRef = viewContainerRef;

    this.subscription = this.playerService.playlistAnnounced$.subscribe(
      playerData => {
        this.isPlaying = playerData ? true : false; // stopped playlist return a null
      }
    );
    if (this.booleanState("tracking-state")) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.configService
            .getSunriseInfo(pos.coords.latitude, pos.coords.longitude)
            .subscribe(data => {
              // set this info back in the service
              this.configService.startDate = new Date(data.results.sunset);
              this.configService.stopDate = new Date(data.results.sunrise);
              this.configService.stopDate.setDate(
                this.configService.stopDate.getDate() + 1
              );
              this.configService.geoSource.next();
              this.configService.applyTheme();
            });
        },
        err => {
          this.configService.startDate = new Date();
          this.configService.startDate.setHours(21, 0, 0);

          this.configService.stopDate = new Date();
          this.configService.stopDate.setDate(
            this.configService.stopDate.getDate() + 1
          );
          this.configService.stopDate.setHours(7, 0, 0);
          this.configService.geoSource.next();
          this.configService.applyTheme();
        }
      );
    } else {
      this.configService.startDate = new Date();
      this.configService.startDate.setHours(21, 0, 0);

      this.configService.stopDate = new Date();
      this.configService.stopDate.setDate(
        this.configService.stopDate.getDate() + 1
      );
      this.configService.stopDate.setHours(7, 0, 0);
      this.configService.geoSource.next();
      this.configService.applyTheme();
    }
    getAccentColor().then(rgba => {
      if (rgba) {
        const colors = getColorsFromRGB(rgba);
        addCustomCss(colors);
      }
    });
  }

  private booleanState(key: string): boolean {
    const raw = localStorage.getItem(key);
    if (raw && raw === "true") {
      return true;
    }
    return false;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.mediaObject = document.querySelector("audio");
    const canPlayType = this.mediaObject.canPlayType("audio/flac");
    this.isFlacSupported =
      canPlayType === "probably" || canPlayType === "maybe";
  }

  getCollection() {
    this.collectionService
      .getCollection()
      .subscribe(
        data => this.fillCollection(data),
        error => console.log(error)
      );
  }
  fillCollection(data: any): void {
    localStorage.setItem("lastParsed", new Date().getTime().toString());
    this.coreService.getCore().parseSourceJson(data, this.isFlacSupported);
    this.isLoading = false;
  }
  hideVolumeWindow(): void {
    this.playerService.hideVolumeControl();
  }

  poll() {
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
          document
            .querySelector("mdb-player")
            .dispatchEvent(new CustomEvent("external.mdbscanstop"));
        }
        this.getCollection();
      }
    });
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
