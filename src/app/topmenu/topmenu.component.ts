import { Component, OnDestroy, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { get } from "idb-keyval";
// import { TooltipModule } from 'ngx-bootstrap';

import { PathService } from "./../utils/path.service";
import { LastfmService } from "./../utils/lastfm.service";
import { musicdbcore } from "./../org/arielext/musicdb/core";
import { CoreService } from "./../utils/core.service";
import { Search } from "./search";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "mdb-topmenu",
  templateUrl: "./topmenu.component.html"
})
export class TopmenuComponent implements OnDestroy, OnInit {
  path: any;
  subscription: Subscription;
  page: any;
  subscription2: Subscription;
  subscription3: Subscription;
  subscription4: Subscription;
  menuVisible = false;
  public topSearchVisible = false;
  public manualScrobblingList: any = [];
  private theme: String;
  public search: Search;
  private core: musicdbcore;
  private letters: Array<any>;

  constructor(
    private pathService: PathService,
    private router: Router,
    private lastFMService: LastfmService,
    private coreService: CoreService
  ) {
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
    this.subscription3 = this.lastFMService.manualScrobbleList$.subscribe(
      data => {
        this.manualScrobblingList = data;
      }
    );
    this.subscription4 = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
    this.search = new Search();
    get("manual-scrobble-list").then(msl => {
      this.manualScrobblingList = msl || [];
    });
  }

  ngOnInit() {
    this.letters = this.core.sortedLetters;
  }

  disableActiveLetter() {
    this.letters.forEach(letter => {
      if (letter.active) {
        letter.active = false;
      }
    });
  }
  activateLetter(letter: any) {
    if (letter) {
      letter.active = true;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // prevent memory leakage
    this.subscription2.unsubscribe();
  }
  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    if (this.menuVisible) {
      this.slideOut();
    } else {
      this.slideIn();
    }
  }
  slideOut() {
    const sideNavEl = document.querySelector(".js-side-nav");
    sideNavEl.classList.add("side-nav--animatable");
    sideNavEl.classList.add("side-nav--visible");
    document.addEventListener("click", this.onDocumentClick);
    sideNavEl.addEventListener("transitionend", this.onTransitionEnd);
  }
  slideIn() {
    const sideNavEl = document.querySelector(".js-side-nav");
    sideNavEl.classList.add("side-nav--animatable");
    sideNavEl.classList.remove("side-nav--visible");
    document.removeEventListener("click", this.onDocumentClick);
    // this.detabinator.inert = true;
    sideNavEl.addEventListener("transitionend", this.onTransitionEnd);
  }
  onTransitionEnd(evt: Event) {
    const sideNavEl = document.querySelector(".js-side-nav");
    sideNavEl.classList.remove("side-nav--animatable");
    sideNavEl.removeEventListener("transitionend", this.onTransitionEnd);
  }
  onSubmit() {
    this.topSearchVisible = false;
    if (this.menuVisible) {
      this.toggleMenu();
    }
    this.router.navigate(["/search", this.search.query]);
  }
  toggleSearch() {
    this.topSearchVisible = !this.topSearchVisible;
    if (this.topSearchVisible === true) {
      setTimeout(function() {
        document.getElementById("mobileSearch").focus();
      }, 100);
    }
  }
  private onDocumentClick = (e: Event) => {
    const target = <HTMLElement>e.target;
    if (target.classList.contains("side-nav--visible")) {
      this.toggleMenu();
    }
  };
  selectArtist(path: any): void {
    this.router.navigate([
      "letter",
      path.artist.letter.escapedLetter,
      "artist",
      path.artist.sortName
    ]);
  }
  selectAlbum(path: any): void {
    this.router.navigate([
      "letter",
      path.album.artist.letter.escapedLetter,
      "artist",
      path.album.artist.sortName,
      "album",
      path.album.sortName
    ]);
  }
}
