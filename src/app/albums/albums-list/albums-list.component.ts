import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { musicdbcore } from "./../../org/arielext/musicdb/core";
import Album from "./../../org/arielext/musicdb/models/Album";
import Artist from "./../../org/arielext/musicdb/models/Artist";
import { CoreService } from "./../../utils/core.service";
import { PathService } from "./../../utils/path.service";

@Component({
  selector: "app-albums-list",
  templateUrl: "./albums-list.component.html"
})
export class AlbumsListComponent implements OnInit, OnDestroy {
  public items: any[] = [];
  public letters: any[] = [];
  public showJumpList = false;
  private cummlativeLength: any[] = [];
  private core: musicdbcore;
  private subscription: Subscription;

  constructor(private coreService: CoreService, private pathService: PathService, private router: Router) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
  }

  public ngOnInit() {
    const s = new Date().getTime();
    this.pathService.announcePage("Albums");
    const artists = this.core.artists;
    this.letters = this.core.sortedLetters;
    const sorted = Object.keys(artists).sort((a, b) => {
      return a < b ? -1 : 1;
    });

    // TODO: what did I try to achieve? A sorted list?
    const tmp: Artist[] = [];
    sorted.forEach(artistName => {
      tmp.push(this.core.artists[artistName]);
    });
    this.items = tmp;
    this.items.forEach((item, index) => {
      const letterLength = this.getSize(item, index);
      if (index > 0) {
        const prevLength = this.cummlativeLength[index - 1].l;
        const newLength = prevLength + letterLength;
        this.cummlativeLength[index] = {
          l: newLength,
          letter: item.letter.letter
        };
      } else {
        this.cummlativeLength[index] = {
          l: letterLength,
          letter: item.letter.letter
        };
      }
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  public navigateToAlbum(album: Album) {
    this.router.navigate(["/letter", album.artist.letter.escapedLetter, "artist", album.artist.sortName, "album", album.sortName]);
  }
  public getSize(item: any, index: number) {
    return item.albums.length * 90 + 49;
  }
  public toggleJumpList() {
    this.showJumpList = !this.showJumpList;
  }
  public jumpToLetter(letter: any) {
    this.showJumpList = false;
    this.items.some((item, i) => {
      let ret = false;
      if (item.letter.letter === letter.letter) {
        const jump = i > 0 ? i - 1 : 0;
        window.scrollTo(0, this.cummlativeLength[jump].l);
        ret = true;
      }
      return ret;
    });
  }
}
