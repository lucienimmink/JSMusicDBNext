import { Component, OnInit } from "@angular/core";
import { Router, RouteParams } from '@angular/router-deprecated';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';
import { ArtistComponent } from './../artist/artist.component';
import { PathService } from './../utils/path.service';


@Component({
  templateUrl: 'app/letter/letterdetail.component.html',
  directives: [ ArtistComponent ],
  styleUrls: [ 'app/letter/letterdetail.component.css' ]
})

export class LetterDetailComponent implements OnInit {
  private letter:string = 'N';
  private artists:Array<any> = [];
  
  constructor (private coreService: CoreService, private router: Router, private routeParams:RouteParams, private pathService: PathService) {}

  ngOnInit() {
    this.letter = decodeURIComponent(this.routeParams.get('letter'));
    let core:musicdbcore = this.coreService.getCore();
    let coreletter = core.letters[this.letter];
    if (coreletter) {
      this.pathService.announcePath(null);
      this.artists = coreletter.sortAndReturnArtistsBy('name', 'asc');
    }
  }
  onSelect(artist:any) {
    this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
  }
}