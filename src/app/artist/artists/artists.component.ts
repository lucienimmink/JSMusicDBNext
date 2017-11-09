import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ArtistComponent } from './../artist/artist.component';
import { musicdbcore } from './../../org/arielext/musicdb/core';
import { CoreService } from './../../utils/core.service';
import { PathService } from './../../utils/path.service';
import { VsForDirective } from './../../utils/vs-for.directive';

@Component({
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit, OnDestroy {

  public letters: Array<any> = [];
  private artists: Array<any> = [];
  public showJumpList = false;
  private core: musicdbcore;
  private subscription: Subscription;
  private cummlativeLength: Array<number> = [];

  constructor(private coreService: CoreService, private pathService: PathService, private router: Router) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(
      data => {
        this.ngOnInit();
      }
    );
  }

  ngOnInit() {
    this.pathService.announcePage('Artists');
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
      letter.sortArtistsBy('sortName', 'asc');
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  navigateToArtist(artist) {
    this.router.navigate(['/letter', artist.letter.escapedLetter, 'artist', artist.sortName]);
  }
  getSize(item, index) {
    return (item.artists.length * 90) + 49;
  }
  toggleJumpList() {
    this.showJumpList = !this.showJumpList;
  }
  jumpToLetter(letter: any) {
    this.showJumpList = false;
    const index = this.letters.indexOf(letter);
    const jump = (index > 0) ? index - 1 : 0;
    window.scrollTo(0, this.cummlativeLength[jump]);
  }
}
