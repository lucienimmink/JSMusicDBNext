import { Component, OnInit } from "@angular/core";
import { Router, RouteParams } from '@angular/router-deprecated';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';
import { AlbumComponent } from './../album/album.component';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { PathService } from './../utils/path.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './../utils/imagelazyloadarea.directive';


@Component({
  templateUrl: 'app/artist/artistdetail.component.html',
  styleUrls: ['app/artist/artistdetail.component.css'],
  directives: [AlbumComponent, BackgroundArtDirective, IMAGELAZYLOAD_DIRECTIVE]
})
export class ArtistDetailComponent implements OnInit {
  private artist: any;
  private albums: Array<any> = [];

  constructor(private coreService: CoreService, private router: Router, private routeParams: RouteParams, private pathService: PathService) { }

  ngOnInit() {
    let artistName = decodeURIComponent(this.routeParams.get('artist'));
    let core: musicdbcore = this.coreService.getCore();
    this.artist = core.artists[artistName];
    if (this.artist) {
      this.pathService.announcePath({ artist: this.artist });
      this.albums = this.artist.sortAndReturnAlbumsBy('year', 'desc');
    }
  }

  onSelect(album: any) {
    this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
  }
}