import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { AlbumComponent } from './album.component';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { CoreService } from './../core.service';
import { PathService } from './../utils/path.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './../utils/imagelazyloadarea.directive';

import * as _ from "lodash";

@Component({
  templateUrl: 'app/album/albums.component.html',
  directives: [AlbumComponent, IMAGELAZYLOAD_DIRECTIVE],
  styleUrls: ['app/album/albums.component.css']
})
export class AlbumsComponent implements OnInit {

  private artists: Array<any> = [];

  constructor(private coreService: CoreService, private pathService: PathService, private router: Router) { }

  ngOnInit() {
    this.pathService.announcePage("Albums");
    let core: musicdbcore = this.coreService.getCore();
    let artists = core.artists;
    let sorted = Object.keys(artists).sort(function (a,b) {
        return (a < b) ? -1 : 1;
    });
    let c = this;
    sorted.forEach(function(artistName) {
      c.artists.push(core.artists[artistName]);
    });
  }
  navigateToAlbum(album) {
    this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
  }
}