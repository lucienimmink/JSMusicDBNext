import { Component, OnInit } from "@angular/core";
import { Router, RouteParams } from '@angular/router-deprecated';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { AlbumArt } from './../utils/albumart.component';
import { CoreService } from './../core.service';
import { AlbumComponent } from './../album/album.component';


@Component({
  templateUrl: 'app/artist/artistdetail.component.html',
  directives: [ AlbumComponent ]
})
export class ArtistDetailComponent implements OnInit {
  private artist:any;
  private albums:Array<any> = [];
  
  constructor (private coreService: CoreService, private router: Router, private routeParams:RouteParams) {}

  ngOnInit() {
    let artistName = decodeURIComponent(this.routeParams.get('artist'));
    let core:musicdbcore = this.coreService.getCore();
    this.artist = core.artists[artistName];
    if (this.artist) {
      this.albums = this.artist.albums;
    }
  }

  onSelect(album:any) {
    this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
  }
}