import { Component, OnInit } from "@angular/core";
import { Router, RouteParams } from '@angular/router-deprecated';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';
import { AlbumArt } from './../utils/albumart.component';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { TimeFormatPipe } from './../timeformat.pipe';
import { PathService } from './../utils/path.service';
import { PlayerService } from './../player/player.service';

@Component({
  templateUrl: 'app/album/albumdetail.component.html',
  pipes: [ TimeFormatPipe ],
  directives: [ AlbumArt, BackgroundArtDirective ],
  styleUrls: [ 'app/album/albumdetail.component.css' ]
})
export class AlbumDetailComponent implements OnInit {
  private albumName:string = '';
  private artistName:string = '';
  private album:any;
  private core:musicdbcore;

  private albumart:AlbumArt;
  
  constructor (private coreService: CoreService, private router: Router, private routeParams:RouteParams, private pathService:PathService, private playerService:PlayerService) {
    this.core = this.coreService.getCore();
    this.core.coreParsed$.subscribe(
      data => {
        this.ngOnInit();
      }
    )
  }

  ngOnInit() {
    let c = this;
    this.albumName = decodeURIComponent(this.routeParams.get('album'));
    this.artistName = decodeURIComponent(this.routeParams.get('artist'));
    this.album = this.core.albums[this.artistName+'|'+this.albumName];
    if (this.album) {
      this.pathService.announcePath({artist: this.album.artist, album:this.album});
    }
  }

  onSelect(track:any) {
    this.playerService.doPlayAlbum(this.album, this.album.tracks.indexOf(track));
  }
  navigateToArtist(artist:any) {
    this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
  }
}