import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { get, set } from "idb-keyval";
import { Subscription } from "rxjs";

import { musicdbcore } from "./../../org/arielext/musicdb/core";
import { CollectionService } from "./../../utils/collection.service";
import { CoreService } from "./../../utils/core.service";
import { LastfmService } from "./../../utils/lastfm.service";
import { PathService } from "./../../utils/path.service";
import { TimeFormatPipe } from "./../../utils/time-format.pipe";

@Component({
  templateUrl: "./scrobble-cache.component.html"
})
export class ScrobbleCacheComponent implements OnInit, OnDestroy {
  public manualScrobbling: boolean = this.booleanState("manual-scrobble-state");
  public manualScrobblingList: any;
  private core: musicdbcore;
  private subscription: Subscription;
  private subscription2: Subscription;
  private isReloading = false;
  private isBusy = false;

  constructor(
    private pathService: PathService,
    private coreService: CoreService,
    private lastFMService: LastfmService,
    private collectionService: CollectionService,
    private router: Router
  ) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
    this.subscription2 = this.lastFMService.manualScrobbleList$.subscribe(data => {
      this.manualScrobblingList = data;
    });
    get("manual-scrobble-list").then(msl => {
      this.manualScrobblingList = msl || [];
    });
  }

  public ngOnInit() {
    this.pathService.announcePage("Scrobble cache");
    get("manual-scrobble-list").then(msl => {
      this.manualScrobblingList = msl || [];
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  public scrobbleNow() {
    this.isBusy = true;
    get("manual-scrobble-list").then(msl => {
      this.manualScrobblingList = msl || [];
      const track = this.manualScrobblingList.pop();
      this.lastFMService.scrobbleCachedTrack(track).subscribe(data => {
        set("manual-scrobble-list", this.manualScrobblingList);
        this.lastFMService.updateManualScrobbleList();
        if (this.manualScrobblingList.length > 0) {
          this.scrobbleNow();
        } else {
          this.isBusy = false;
        }
      });
    });
  }
  public removeFromScrobbleList(item: any) {
    get("manual-scrobble-list").then(msl => {
      this.manualScrobblingList = msl || [];
      let index = -1;
      this.manualScrobblingList.forEach((value, i) => {
        if (Object.is(value, item)) {
          index = i;
        }
      });
      this.manualScrobblingList.splice(index, 1);
      set("manual-scrobble-list", this.manualScrobblingList);
    });
  }

  private booleanState(key: string): boolean {
    const raw = localStorage.getItem(key);
    if (raw && raw === "true") {
      return true;
    }
    return false;
  }
}
