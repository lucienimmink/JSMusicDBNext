import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { PathService } from './../../utils/path.service';
import { CoreService } from './../../utils/core.service';
import { CollectionService } from './../../utils/collection.service';
import { musicdbcore } from './../../org/arielext/musicdb/core';
import { TimeFormatPipe } from './../../utils/time-format.pipe';
import { ArtistComponent } from './../../artist/artist/artist.component';
import { AlbumComponent } from './../../album/album/album.component';
import { TrackComponent } from './../../track/track/track.component';
import Track from './../../org/arielext/musicdb/models/track';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  private core: musicdbcore;
  private subscription: Subscription;
  public artists: any;
  public albums: any;
  public tracks: any;
  private query: string;
  private MAXALLOWEDITEMS = 15;

  constructor(private pathService: PathService, private coreService: CoreService, private router: Router, private route: ActivatedRoute) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(
      data => {
        this.ngOnInit();
      }
    );
    this.query = decodeURIComponent(this.route.snapshot.params['query']);
    this.route.params.subscribe(data => {
      this.query = data['query'];
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.pathService.announcePage(`Results for "${this.query}"`);
    this.artists = this.spliceList(this.core.searchArtist(this.query), this.MAXALLOWEDITEMS);
    this.albums = this.spliceList(this.core.searchAlbum(this.query), this.MAXALLOWEDITEMS);
    this.tracks = this.spliceList(this.core.searchTrack(this.query), this.MAXALLOWEDITEMS);

  }

  spliceList(results: Array<any>, count: number) {
    let ret = false;
    let view = results;
    if (results.length > count) {
      view = results.splice(0, count);
      ret = true;
    }
    return {
      list: view,
      overflow: ret
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  select(track: Track) {
    this.router.navigate(['/letter', track.album.artist.letter.escapedLetter, 'artist', track.album.artist.sortName,
      'album', track.album.sortName]);
  }
}
