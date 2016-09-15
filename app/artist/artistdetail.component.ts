import { Component, OnInit, OnDestroy, NgModule } from "@angular/core";
import { Router } from '@angular/router';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';
import { AlbumComponent } from './../album/album.component';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { PathService } from './../utils/path.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './../utils/imagelazyloadarea.directive';
import { Subscription }   from 'rxjs/Subscription';

@NgModule({
  declarations: [AlbumComponent, BackgroundArtDirective, IMAGELAZYLOAD_DIRECTIVE]
})
@Component({
  templateUrl: 'app/artist/artistdetail.component.html',
  styleUrls: ['dist/artist/artistdetail.component.css']
})
export class ArtistDetailComponent implements OnInit, OnDestroy {
  private artist: any;
  private albums: Array<any> = [];
  private core:musicdbcore;
  private subscription: Subscription;

  constructor(private coreService: CoreService, private router: Router, private pathService: PathService) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(
      data => {
        this.ngOnInit();
      }
    )
  }

  ngOnInit() {
    //let artistName = decodeURIComponent(this.routeParams.get('artist'));
    let artistName = "MUSE";
    this.artist = this.core.artists[artistName];
    if (this.artist) {
      this.pathService.announcePath({ artist: this.artist });
      this.albums = this.artist.sortAndReturnAlbumsBy('year', 'asc');
    }
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSelect(album: any) {
    this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
  }
}