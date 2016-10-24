import { Component, OnInit, OnDestroy, NgModule } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';
import { AlbumComponent } from './../album/album.component';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { PathService } from './../utils/path.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './../utils/imagelazyloadarea.directive';
import { Subscription } from 'rxjs/Subscription';

@NgModule({
  declarations: [AlbumComponent, BackgroundArtDirective, IMAGELAZYLOAD_DIRECTIVE]
})
@Component({
  templateUrl: 'app/artist/artistdetail.component.html',
  styleUrls: ['dist/artist/artistdetail.component.css']
})
export class ArtistDetailComponent implements OnInit, OnDestroy {
  private artistName: string;
  private artist: any;
  private albums: Array<any> = [];
  private core: musicdbcore;
  private subscription: Subscription;
  private sorting:Array<string> = ['year', 'name'];

  constructor(private coreService: CoreService, private router: Router, private pathService: PathService, private route: ActivatedRoute) {
    this.artistName = decodeURIComponent(this.route.snapshot.params['artist']);
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(
      data => {
        this.ngOnInit();
      }
    );
    this.route.params.subscribe(data => {
      this.artistName = decodeURIComponent(data["artist"]);
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.artist = this.core.artists[this.artistName];
    if (this.artist) {
      this.pathService.announcePath({ artist: this.artist, letter: this.artist.letter });
      this.albums = this.artist.sortAndReturnAlbumsBy('year', 'asc');
    }
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSelect(album: any) {
    this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
  }

  onSortChange(sort:string) {
    this.albums = this.artist.sortAndReturnAlbumsBy(sort, 'asc');
  }
}