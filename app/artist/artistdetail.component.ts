import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';
import { AlbumComponent } from './../album/album.component';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { PathService } from './../utils/path.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './artistdetail.component.html'
})
export class ArtistDetailComponent implements OnInit, OnDestroy {
  private artistName: string;
  private artist: any;
  private albums: Array<any> = [];
  private core: musicdbcore;
  private subscription: Subscription;
  private sorting: Array<any> = [{name: 'year', value: 'year'}, {name: 'name', value: 'sortName'}];

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