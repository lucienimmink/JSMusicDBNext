
import { Component, OnInit } from "@angular/core";
import { Router, RouteParams } from '@angular/router-deprecated';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';


@Component({
  templateUrl: 'app/letter/letterdetail.component.html'
})

export class LetterDetailComponent implements OnInit {
  private letter:string = 'N';
  private artists:Array<any> = [];
  
  constructor (private coreService: CoreService, private router: Router, private routeParams:RouteParams) {}

  ngOnInit() {
    this.letter = decodeURIComponent(this.routeParams.get('letter'));
    let core:musicdbcore = this.coreService.getCore();
    this.artists = core.letters[this.letter].artists;
  }
  onSelect(artist:any) {
    this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
  }
}