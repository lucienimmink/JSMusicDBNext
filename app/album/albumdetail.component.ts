import { Component, OnInit } from "@angular/core";
import { Router, RouteParams } from '@angular/router-deprecated';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';


@Component({
  templateUrl: 'app/album/albumdetail.component.html'
})
export class AlbumDetailComponent implements OnInit {
  private albumName:string = '';
  private album:any;
  
  constructor (private coreService: CoreService, private router: Router, private routeParams:RouteParams) {}

  ngOnInit() {
    this.albumName = decodeURIComponent(this.routeParams.get('album'));
    let core:musicdbcore = this.coreService.getCore();
    this.album = core.albums[this.albumName];
  }

  onSelect(track:any) {
    // setup the player
  }
}