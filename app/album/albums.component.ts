import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { AlbumComponent } from './album.component';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { CoreService } from './../core.service';
import { PathService } from './../utils/path.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './../utils/imagelazyloadarea.directive';
import { VsFor } from './../utils/ng2-vs-for';

import * as _ from "lodash";

@Component({
  templateUrl: 'app/album/albums.component.html',
  directives: [AlbumComponent, IMAGELAZYLOAD_DIRECTIVE, VsFor],
  styleUrls: ['app/album/albums.component.css']
})
export class AlbumsComponent implements OnInit {

  private items: Array<any> = [];

  constructor(private coreService: CoreService, private pathService: PathService, private router: Router) { }

  ngOnInit() {
    let s = new Date().getTime();
    this.pathService.announcePage("Albums");
    let core: musicdbcore = this.coreService.getCore();
    let artists = core.artists;
    let sorted = Object.keys(artists).sort(function (a, b) {
      return (a < b) ? -1 : 1;
    });
    let tmp = [];
    sorted.forEach(function (artistName) {
      tmp.push(core.artists[artistName]);
    });
    this.items = tmp;
  }
  navigateToAlbum(album) {
    this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
  }
  getSize(item, index) {
    return (item.albums.length * 70) + 69; 
  }
}