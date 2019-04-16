import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { musicdbcore } from "./../../org/arielext/musicdb/core";
import { CoreService } from "./../../utils/core.service";
import { PathService } from "./../../utils/path.service";

@Component({
  selector: "app-artists",
  templateUrl: "./artists.component.html"
})
export class ArtistsComponent implements OnInit, OnDestroy {
  public letters: any[] = [];
  public showJumpList = false;
  private core: musicdbcore;
  private subscription: Subscription;
  private cummlativeLength: number[] = [];

  constructor(private coreService: CoreService, private pathService: PathService, private router: Router) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
  }

  public ngOnInit() {
    this.pathService.announcePage("Artists");
    this.letters = this.core.sortedLetters;
    this.letters.forEach((letter, index) => {
      const letterLength = this.getSize(letter, index);
      if (index > 0) {
        const prevLength = this.cummlativeLength[index - 1];
        const newLength = prevLength + letterLength;
        this.cummlativeLength[index] = newLength;
      } else {
        this.cummlativeLength[index] = letterLength;
      }
      // sort artists by sortName
      letter.sortArtistsBy("sortName", "asc");
    });
  }
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  public navigateToArtist(artist) {
    this.router.navigate(["/letter", artist.letter.escapedLetter, "artist", artist.sortName]);
  }
  public getSize(item, index) {
    return item.artists.length * 90 + 49;
  }
  public toggleJumpList() {
    this.showJumpList = !this.showJumpList;
  }
  public jumpToLetter(letter: any) {
    this.showJumpList = false;
    const index = this.letters.indexOf(letter);
    const jump = index > 0 ? index - 1 : 0;
    window.scrollTo(0, this.cummlativeLength[jump]);
  }
}
