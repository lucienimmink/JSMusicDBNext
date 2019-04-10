import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { musicdbcore } from "../../org/arielext/musicdb/core";
import Letter from "../../org/arielext/musicdb/models/Letter";
import { CoreService } from "../../utils/core.service";
import { PathService } from "../../utils/path.service";

@Component({
  selector: "app-letter-detail",
  templateUrl: "./letter-detail.component.html"
})
export class LetterDetailComponent implements OnInit, OnDestroy {
  public artists: any[] = [];
  public sorting: any[] = [{ name: "name", value: "sortName" }, { name: "albums", value: "albums" }];
  public sort: string;
  private letter: string;
  private core: musicdbcore;
  private subscription: Subscription;
  private coreletter: Letter;

  constructor(private coreService: CoreService, private router: Router, private pathService: PathService, private route: ActivatedRoute) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
    this.letter = decodeURIComponent(this.route.snapshot.params.letter);
    this.route.params.subscribe(data => {
      this.letter = decodeURIComponent(data.letter);
      this.ngOnInit();
    });
  }

  public ngOnInit() {
    this.coreletter = this.core.letters[this.letter];
    if (this.coreletter) {
      this.pathService.announcePage("JSMusicDB Next", this.coreletter);
      this.artists = this.coreletter.sortAndReturnArtistsBy("sortName", "asc");
    }
  }
  public onSelect(artist: any) {
    this.router.navigate(["Artist", { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
  }
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  public onSortChange(e: Event, sort: string) {
    this.artists = this.coreletter.sortAndReturnArtistsBy(sort, "asc");
  }
}
