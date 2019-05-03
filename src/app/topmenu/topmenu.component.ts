import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { get } from "idb-keyval";
import { TooltipConfig } from "ngx-bootstrap/tooltip";
import { Subscription } from "rxjs";
// import { TooltipModule } from 'ngx-bootstrap';
import { musicdbcore } from "./../org/arielext/musicdb/core";
import { CoreService } from "./../utils/core.service";
import { LastfmService } from "./../utils/lastfm.service";
import { PathService } from "./../utils/path.service";
import { Search } from "./search";

export function getAlertConfig(): TooltipConfig {
  return Object.assign(new TooltipConfig(), {
    placement: "right",
    delay: 250,
  });
}
@Component({
  // tslint:disable-next-line:component-selector
  selector: "mdb-topmenu",
  templateUrl: "./topmenu.component.html",
  providers: [{ provide: TooltipConfig, useFactory: getAlertConfig }],
})
export class TopmenuComponent implements OnDestroy, OnInit {
  public path: any;
  public subscription: Subscription;
  public page: any;
  public subscription2: Subscription;
  public subscription3: Subscription;
  public subscription4: Subscription;
  public menuVisible = false;
  public topSearchVisible = false;
  public manualScrobblingList: any = [];
  public search: Search;
  private theme: string;
  private core: musicdbcore;
  private letters: any[];

  constructor(private pathService: PathService, private router: Router, private lastFMService: LastfmService, private coreService: CoreService) {
    this.core = this.coreService.getCore();
    // subscribe to a change in path; so we can display it
    this.subscription = pathService.pathAnnounced$.subscribe(path => {
      this.path = path;
      this.page = null;
      this.menuVisible = false;
      this.disableActiveLetter();
      this.activateLetter(path.letter);
    });
    this.subscription2 = pathService.pageAnnounced$.subscribe(page => {
      this.page = page.page;
      this.path = null;
      this.menuVisible = false;
      this.disableActiveLetter();
      this.activateLetter(page.letter);
    });
    this.subscription3 = this.lastFMService.manualScrobbleList$.subscribe(data => {
      this.manualScrobblingList = data;
    });
    this.subscription4 = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
    this.search = new Search();
    get("manual-scrobble-list").then(msl => {
      this.manualScrobblingList = msl || [];
    });
  }

  public ngOnInit() {
    this.letters = this.core.sortedLetters;
  }

  public disableActiveLetter() {
    this.letters.forEach(letter => {
      if (letter.active) {
        letter.active = false;
      }
    });
  }
  public activateLetter(letter: any) {
    if (letter) {
      letter.active = true;
    }
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe(); // prevent memory leakage
    this.subscription2.unsubscribe();
  }
  public toggleMenu() {
    this.menuVisible = !this.menuVisible;
    if (this.menuVisible) {
      this.slideOut();
    } else {
      this.slideIn();
    }
  }
  public slideOut() {
    const sideNavEl = document.querySelector(".js-side-nav");
    sideNavEl.classList.add("side-nav--animatable");
    sideNavEl.classList.add("side-nav--visible");
    document.addEventListener("click", this.onDocumentClick);
    sideNavEl.addEventListener("transitionend", this.onTransitionEnd);
  }
  public slideIn() {
    const sideNavEl = document.querySelector(".js-side-nav");
    sideNavEl.classList.add("side-nav--animatable");
    sideNavEl.classList.remove("side-nav--visible");
    document.removeEventListener("click", this.onDocumentClick);
    // this.detabinator.inert = true;
    sideNavEl.addEventListener("transitionend", this.onTransitionEnd);
  }
  public onTransitionEnd(evt: Event) {
    const sideNavEl = document.querySelector(".js-side-nav");
    sideNavEl.classList.remove("side-nav--animatable");
    sideNavEl.removeEventListener("transitionend", this.onTransitionEnd);
  }
  public onSubmit() {
    this.topSearchVisible = false;
    if (this.menuVisible) {
      this.toggleMenu();
    }
    this.router.navigate(["/search", this.search.query]);
  }
  public toggleSearch() {
    this.topSearchVisible = !this.topSearchVisible;
    if (this.topSearchVisible === true) {
      setTimeout(() => {
        document.getElementById("mobileSearch").focus();
      }, 100);
    }
  }
  public selectArtist(path: any): void {
    this.router.navigate(["letter", path.artist.letter.escapedLetter, "artist", path.artist.sortName]);
  }
  public selectAlbum(path: any): void {
    this.router.navigate(["letter", path.album.artist.letter.escapedLetter, "artist", path.album.artist.sortName, "album", path.album.sortName]);
  }
  private onDocumentClick = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("side-nav--visible")) {
      this.toggleMenu();
    }
  };
}
