import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { musicdbcore } from './../../org/arielext/musicdb/core';

import { Subscription } from 'rxjs';
import { AlbumComponent } from './../../album/album/album.component';
import { BackgroundArtDirective } from './../../utils/background-art.directive';
import { CoreService } from './../../utils/core.service';
import { PathService } from './../../utils/path.service';

@Component({
  templateUrl: './artist-detail.component.html'
})
export class ArtistDetailComponent implements OnInit, OnDestroy {
  public albums: any[] = [];
  public sorting: any[] = [{ name: 'year', value: 'year' }, { name: 'name', value: 'sortName' }];
  public sort: string;
  private artistName: string;
  private artist: any;
  private core: musicdbcore;
  private subscription: Subscription;

  constructor(private coreService: CoreService, private router: Router, private pathService: PathService, private route: ActivatedRoute) {
    this.artistName = decodeURIComponent(this.route.snapshot.params.artist);
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(
      data => {
        this.ngOnInit();
      }
    );
    this.route.params.subscribe(data => {
      this.artistName = decodeURIComponent(data.artist);
      this.ngOnInit();
    });
  }
  public ngOnInit() {
    this.artist = this.core.artists[this.artistName];
    if (this.artist) {
      this.pathService.announcePath({ artist: this.artist, letter: this.artist.letter });
      this.albums = this.artist.sortAndReturnAlbumsBy('year', 'asc');
    }
  }
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  public onSelect(album: any) {
    this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
  }
  public onSortChange(e: Event, sort: string) {
    this.albums = this.artist.sortAndReturnAlbumsBy(sort, 'asc');
  }
}
