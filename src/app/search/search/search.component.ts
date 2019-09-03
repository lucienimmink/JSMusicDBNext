import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { musicdbcore } from "../../org/arielext/musicdb/core";
import Track from "../../org/arielext/musicdb/models/Track";
import { CoreService } from "../../utils/core.service";
import { PathService } from "../../utils/path.service";

@Component({
  templateUrl: "./search.component.html",
})
export class SearchComponent implements OnInit, OnDestroy {
  public artists: any;
  public albums: any;
  public tracks: any;
  private core: musicdbcore;
  private subscription: Subscription;
  private query: string;
  private MAXALLOWEDITEMS = 100;

  constructor(private pathService: PathService, private coreService: CoreService, private router: Router, private route: ActivatedRoute) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
    this.query = decodeURIComponent(this.route.snapshot.params.query);
    this.route.params.subscribe(data => {
      this.query = data.query;
      this.ngOnInit();
    });
  }

  public ngOnInit() {
    this.pathService.announcePage(`Results for "${this.query}"`);
    this.artists = this.spliceList(this.core.searchArtist(this.query), this.MAXALLOWEDITEMS);
    this.albums = this.spliceList(this.core.searchAlbum(this.query), this.MAXALLOWEDITEMS);
    this.tracks = this.spliceList(this.core.searchTrack(this.query), this.MAXALLOWEDITEMS);
  }

  public spliceList(results: any[], count: number) {
    let ret = false;
    let view = results;
    if (results.length > count) {
      view = results.splice(0, count);
      ret = true;
    }
    return {
      list: view,
      overflow: ret,
    };
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public select(track: Track) {
    this.router.navigate(["/letter", track.album.artist.letter.escapedLetter, "artist", track.album.artist.sortName, "album", track.album.sortName]);
  }
}
