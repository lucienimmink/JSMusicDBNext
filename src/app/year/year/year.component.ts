import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AlbumComponent } from "./../../album/album/album.component";
import { musicdbcore } from "./../../org/arielext/musicdb/core";
import { CoreService } from "./../../utils/core.service";
import { PathService } from "./../../utils/path.service";
import { VsForDirective } from "./../../utils/vs-for.directive";

import Album from "./../../org/arielext/musicdb/models/album";

@Component({
  templateUrl: "./year.component.html"
})
export class YearComponent implements OnInit, OnDestroy {
  public items: Array<any> = [];
  public years: Array<any> = [];
  public showJumpList = false;
  private cummlativeLength: Array<any> = [];
  private core: musicdbcore;
  private subscription: Subscription;

  constructor(
    private coreService: CoreService,
    private pathService: PathService,
    private router: Router
  ) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.pathService.announcePage("Years");
    const yearsobject = this.core.years;
    const sorted = Object.keys(yearsobject).sort(function(a, b) {
      return parseInt(a, 10) < parseInt(b, 10) ? 1 : -1;
    });
    const tmp: Array<any> = [];
    sorted.forEach(year => {
      if (year !== "undefined") {
        tmp.push(this.core.years[year]);
        this.years.push(year);
      }
    });
    this.items = tmp;
    this.items.forEach((item, index) => {
      const letterLength = this.getSize(item, index);
      if (index > 0) {
        const prevLength = this.cummlativeLength[index - 1].l;
        const newLength = prevLength + letterLength;
        this.cummlativeLength[index] = {
          l: newLength,
          year: item.year.year
        };
      } else {
        this.cummlativeLength[index] = {
          l: letterLength,
          year: item.year.year
        };
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  navigateToAlbum(album: Album) {
    this.router.navigate([
      "/letter",
      album.artist.letter.escapedLetter,
      "artist",
      album.artist.sortName,
      "album",
      album.sortName
    ]);
  }
  getSize(item: any, index: number) {
    return item.albums.length * 90 + 39;
  }
  toggleJumpList() {
    this.showJumpList = !this.showJumpList;
  }
  jumpToLetter(year: any) {
    this.showJumpList = false;

    this.items.some((item, i) => {
      let ret = false;
      if (item.year === parseInt(year, 10)) {
        const jump = i > 0 ? i - 1 : 0;
        if (jump === 0) {
          window.scrollTo(0, 0);
        } else {
          window.scrollTo(0, this.cummlativeLength[jump].l);
        }
        ret = true;
      }
      return ret;
    });
  }
}
