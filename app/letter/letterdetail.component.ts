
import { Component, OnInit } from "@angular/core";
import { Router, RouteParams } from '@angular/router-deprecated';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';
import { ArtistComponent } from './../artist/artist.component';


@Component({
  templateUrl: 'app/letter/letterdetail.component.html',
  directives: [ ArtistComponent ],
  styleUrls: [ 'app/letter/letterdetail.component.css' ]
})

export class LetterDetailComponent implements OnInit {
  private letter:string = 'N';
  private artists:Array<any> = [];
  
  constructor (private coreService: CoreService, private router: Router, private routeParams:RouteParams) {}

  ngOnInit() {
    this.letter = decodeURIComponent(this.routeParams.get('letter'));
    let core:musicdbcore = this.coreService.getCore();
    let coreletter = core.letters[this.letter];
    if (coreletter) {
      this.artists = coreletter.artists;
    }
  }
  onSelect(artist:any) {
    this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
  }
}