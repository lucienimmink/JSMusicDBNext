import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, RouteParams } from '@angular/router-deprecated';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';
import { AlbumArt } from './../utils/albumart.component';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { TimeFormatPipe } from './../timeformat.pipe';

@Component({
  templateUrl: 'app/album/albumdetail.component.html',
  pipes: [ TimeFormatPipe ],
  directives: [ AlbumArt, BackgroundArtDirective ],
  styleUrls: [ 'app/album/albumdetail.component.css' ]
})
export class AlbumDetailComponent implements OnInit {
  private albumName:string = '';
  private album:any;

  @ViewChild(AlbumArt)
  private albumart:AlbumArt;
  
  constructor (private coreService: CoreService, private router: Router, private routeParams:RouteParams) {}

  ngOnInit() {
    let c = this;
    this.albumName = decodeURIComponent(this.routeParams.get('album'));
    let core:musicdbcore = this.coreService.getCore();
    this.album = core.albums[this.albumName];
    // avoid timing issue
    setTimeout(function () {
      if (c.albumart) {
        c.albumart.setAlbum(c.album);
      }
    }, 0);
  }

  onSelect(track:any) {
    // setup the player
  }
  navigateToArtist(artist:any) {
    this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
  }
}