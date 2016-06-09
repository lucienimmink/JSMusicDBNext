import { Component, OnInit } from "@angular/core";
import { Router, RouteParams } from '@angular/router-deprecated';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';


@Component({
  templateUrl: 'app/artist/artistdetail.component.html'
})
export class ArtistDetailComponent implements OnInit {
  private artistName:string = '';
  private artist:any;
  private albums:Array<any> = [];
  
  constructor (private coreService: CoreService, private router: Router, private routeParams:RouteParams) {}

  ngOnInit() {
    this.artistName = decodeURIComponent(this.routeParams.get('artist'));
    let core:musicdbcore = this.coreService.getCore();
    this.artist = core.artists[this.artistName]
    this.albums = this.artist.albums;
  }

  onSelect(album:any) {
    this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
  }
}