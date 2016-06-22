import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, RouteParams } from '@angular/router-deprecated';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';
import { ArtistComponent } from './../artist/artist.component';
import { PathService } from './../utils/path.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './../utils/imagelazyloadarea.directive';
import { Subscription }   from 'rxjs/Subscription';


@Component({
  templateUrl: 'app/letter/letterdetail.component.html',
  directives: [ ArtistComponent, IMAGELAZYLOAD_DIRECTIVE ],
  styleUrls: [ 'app/letter/letterdetail.component.css' ]
})

export class LetterDetailComponent implements OnInit, OnDestroy {
  private letter:string;
  private artists:Array<any> = [];
  private core:musicdbcore;
  private subscription: Subscription;

  constructor (private coreService: CoreService, private router: Router, private routeParams:RouteParams, private pathService: PathService) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(
      data => {
        this.ngOnInit();
      }
    )
  }

  ngOnInit() {
    this.letter = decodeURIComponent(this.routeParams.get('letter'));
    let coreletter = this.core.letters[this.letter];
    if (coreletter) {
      this.pathService.announcePage('JSMusicDB Next');
      this.artists = coreletter.sortAndReturnArtistsBy('name', 'asc');
    }
  }
  onSelect(artist:any) {
    this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}