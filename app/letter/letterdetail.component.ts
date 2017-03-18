import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { musicdbcore } from './../org/arielext/musicdb/core';
import Letter from './../org/arielext/musicdb/models/Letter';

import { CoreService } from './../core.service';
import { ArtistComponent } from './../artist/artist.component';
import { PathService } from './../utils/path.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './../utils/imagelazyloadarea.directive';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: 'app/letter/letterdetail.component.html',
  styleUrls: ['dist/letter/letterdetail.component.css']
})
export class LetterDetailComponent implements OnInit, OnDestroy {
  private letter: string;
  private artists: Array<any> = [];
  private core: musicdbcore;
  private subscription: Subscription;
  private sorting: Array<any> = [{name: 'name', value: 'sortName'}, {name: 'albums', value: 'albums'}];
  private coreletter: Letter;

  constructor(private coreService: CoreService, private router: Router, private pathService: PathService, private route: ActivatedRoute) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(
      data => {
        this.ngOnInit();
      }
    )
    this.letter = decodeURIComponent(this.route.snapshot.params['letter']);
    this.route.params.subscribe(data => {
      this.letter = decodeURIComponent(data["letter"]);
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.coreletter = this.core.letters[this.letter];
    if (this.coreletter) {
      this.pathService.announcePage('JSMusicDB Next', this.coreletter);
      this.artists = this.coreletter.sortAndReturnArtistsBy('sortName', 'asc');
    }
  }
  onSelect(artist: any) {
    this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onSortChange(sort: string) {
    this.artists = this.coreletter.sortAndReturnArtistsBy(sort, 'asc');
  }
}