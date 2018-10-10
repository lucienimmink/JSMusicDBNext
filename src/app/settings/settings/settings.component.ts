import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  AfterViewChecked,
  ViewChild
} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Subscription, Subject } from "rxjs";
import { get, set, del } from "idb-keyval";

import { PathService } from "./../../utils/path.service";
import { CoreService } from "./../../utils/core.service";
import { CollectionService } from "./../../utils/collection.service";
import { musicdbcore } from "./../../org/arielext/musicdb/core";
import { TimeFormatPipe } from "./../../utils/time-format.pipe";
import { LastfmService } from "./../../utils/lastfm.service";
import { ConfigService } from "./../../utils/config.service";
import getColors, {
  saveColors,
  addCustomCss,
  getAccentColor,
  convertRGBtoString
} from "./../../utils/colorutil";
import { ColorService } from "../../utils/color.service";
import { Settings } from "./../settings";

declare function require(moduleName: string): any;
const { version: appVersion } = require("../../../../package.json");

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html"
})
export class SettingsComponent implements OnInit, OnDestroy, AfterViewChecked {
  public totals: any;
  private core: musicdbcore;
  public lastfmusername: string;
  public connectiontype = "node-mp3stream"; // we can implement more connection types later on (dsm, local, etc)
  public connectiondetails = "";
  private subscription: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  public savePlaylistState: boolean = this.booleanState("save-playlist-state");
  private manualScrobbling: boolean = this.booleanState(
    "manual-scrobble-state"
  );
  public isContinuesplay: boolean = this.booleanState("continues-play");
  private smallArt: boolean = this.booleanState("small-art");
  private manualScrobblingList: any;
  public isReloading = false;
  public scanperc = 0;
  public version: String = "__dev__";
  public settings: Settings;
  private hasBeenReloading = false;
  public lastParsed: number = Number(localStorage.getItem("lastParsed"));

  public visualisation: boolean = this.booleanState("visualisation-state");
  public tracking: boolean = this.booleanState("tracking-state");
  public preferVideo: boolean = this.booleanState("preferVideo-state");

  public addToHomescreen: boolean = false;

  public startDate: Date;
  public stopDate: Date;

  private themeForm: NgForm;
  @ViewChild("themeForm") currentForm: NgForm;
  private theme: string;
  public mode: string;

  public isVisualCapable: boolean = navigator.userAgent.indexOf("Mobi") === -1;
  public color: string;

  constructor(
    private pathService: PathService,
    private coreService: CoreService,
    private lastFMService: LastfmService,
    private collectionService: CollectionService,
    private router: Router,
    private configService: ConfigService,
    private colorService: ColorService
  ) {
    this.settings = new Settings();
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
    this.subscription2 = this.lastFMService.manualScrobbleList$.subscribe(
      data => {
        this.manualScrobblingList = data;
      }
    );
    this.subscription3 = this.configService.theme$.subscribe(data => {
      this.settings.theme = data;
      this.theme = data;
    });
    this.subscription4 = this.configService.mode$.subscribe(data => {
      this.mode = data;
    });
    // setup a form for changing stuff
    this.settings.theme = this.configService.theme;
    this.theme = this.configService.theme;
    this.mode = this.configService.mode;

    // check if the collection is in reloading state
    this.poll();

    this.version = appVersion;

    get("manual-scrobble-list").then(msl => {
      this.manualScrobblingList = msl || [];
    });
    getAccentColor().then(rgba => {
      this.color = convertRGBtoString(rgba);
    });
  }

  private booleanState(key: string): boolean {
    const raw = localStorage.getItem(key);
    if (raw && raw === "true") {
      return true;
    }
    return false;
  }
  ngAfterViewChecked() {
    this.formChanged();
  }
  formChanged() {
    if (this.currentForm === this.themeForm) {
      return;
    }
    this.themeForm = this.currentForm;
    if (this.themeForm) {
      this.themeForm.valueChanges.subscribe(data => {
        if (data && data.theme) {
          this.configService.theme = data.theme;
          this.theme = data.theme;
        }
      });
    }
  }

  ngOnInit() {
    this.pathService.announcePage("Settings");
    this.totals = this.core.totals;
    this.lastfmusername = localStorage.getItem("lastfm-username") || "";
    this.connectiondetails = localStorage.getItem("dsm");
    get("manual-scrobble-list").then(msl => {
      this.manualScrobblingList = msl || [];
    });
    this.lastParsed = Number(localStorage.getItem("lastParsed"));

    // before the call; generic data
    this.startDate = this.configService.startDate;
    this.stopDate = this.configService.stopDate;

    this.configService.geo$.subscribe(() => {
      // and now it's updated for this specific location
      this.startDate = this.configService.startDate;
      this.stopDate = this.configService.stopDate;
    });

    if (window["deferredPrompt"]) {
      this.addToHomescreen = true;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
  }

  removeLastfm() {
    localStorage.removeItem("lastfm-username");
    localStorage.removeItem("lastfm-token");
    this.ngOnInit();
  }
  removeConnection() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("dsm");
    this.ngOnInit();
  }
  toggleSavePlaylistState() {
    this.savePlaylistState = !this.savePlaylistState;
    localStorage.setItem(
      "save-playlist-state",
      this.savePlaylistState.toString()
    );
  }
  toggleContinuesPlay() {
    this.isContinuesplay = !this.isContinuesplay;
    localStorage.setItem("continues-play", this.isContinuesplay.toString());
  }
  toggleManualScrobbling() {
    this.manualScrobbling = !this.manualScrobbling;
    localStorage.setItem(
      "manual-scrobble-state",
      this.manualScrobbling.toString()
    );
    get("manual-scrobble-list").then(msl => {
      this.manualScrobblingList = msl || [];
    });
  }
  toggleVisualisation() {
    this.visualisation = !this.visualisation;
    if (!this.visualisation) {
      // small art without visualisation is not needed.
      this.smallArt = false;
      localStorage.setItem("small-art", this.smallArt.toString());
    }
    localStorage.setItem("visualisation-state", this.visualisation.toString());
  }
  togglePreferVideo() {
    this.preferVideo = !this.preferVideo;
    localStorage.setItem("preferVideo-state", this.preferVideo.toString());
  }
  toggleSmallArt() {
    this.smallArt = !this.smallArt;
    localStorage.setItem("small-art", this.smallArt.toString());
  }
  toggleTracking() {
    this.tracking = !this.tracking;
    localStorage.setItem("tracking-state", this.tracking.toString());
    if (this.tracking) {
      this.getLocation();
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
  }
  private getLocation(): void {
    navigator.geolocation.getCurrentPosition(pos => {
      set("coords", pos);

      if (pos) {
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
    });
  }
  scrobbleNow() {
    get("manual-scrobble-list").then(msl => {
      this.manualScrobblingList = msl || [];
      const track = this.manualScrobblingList.pop();
      this.lastFMService.scrobbleCachedTrack(track).subscribe(data => {
        set("manual-scrobble-list", this.manualScrobblingList);
        if (this.manualScrobblingList.length > 0) {
          this.scrobbleNow();
        }
      });
    });
  }
  removeFromScrobbleList(item: any) {
    get("manual-scrobble-list").then(msl => {
      this.manualScrobblingList = msl || [];
      let index = -1;
      this.manualScrobblingList.forEach(function(value, i) {
        if (Object.is(value, item)) {
          index = i;
        }
      });
      this.manualScrobblingList.splice(index, 1);
      set("manual-scrobble-list", this.manualScrobblingList);
    });
  }
  reloadCollection() {
    this.isReloading = true;
    document
      .querySelector("mdb-player")
      .dispatchEvent(new CustomEvent("external.mdbscanstart"));
    this.collectionService.reload().subscribe(data => {
      setTimeout(e => {
        this.poll();
      }, 300);
    });
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
          this.getCollection();
        }
      }
    });
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
    this.hasBeenReloading = false;
    this.coreService.getCore().parseSourceJson(data);
  }

  viewList() {
    this.router.navigate(["/scrobble-cache"]);
  }

  doAddToHomescreen() {
    if (window["deferredPrompt"]) {
      const e: any = window["deferredPrompt"];
      e.prompt();
      e.userChoice.then(result => {
        del("defferedPrompt");
      });
    }
  }

  changeAccentColor(color: string) {
    const colors = getColors(color);
    saveColors(colors);
    addCustomCss(colors);
    this.colorService.setColor(colors.rgba);
  }
}
