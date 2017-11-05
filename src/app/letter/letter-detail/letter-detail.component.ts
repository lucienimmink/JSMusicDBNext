import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { musicdbcore } from './../../org/arielext/musicdb/core';
import Letter from './../../org/arielext/musicdb/models/Letter';
import { CoreService } from './../../utils/core.service';
import { ArtistComponent } from './../../artist/artist/artist.component';
import { PathService } from './../../utils/path.service';

@Component({
  selector: 'app-letter-detail',
  templateUrl: './letter-detail.component.html',
  styleUrls: ['./letter-detail.component.css']
})
export class LetterDetailComponent implements OnInit, OnDestroy {
  private letter: string;
  public artists: Array<any> = [];
  private core: musicdbcore;
  private subscription: Subscription;
  public sorting: Array<any> = [{ name: 'name', value: 'sortName' }, { name: 'albums', value: 'albums' }];
  private coreletter: Letter;
  public sort:string;

  constructor(private coreService: CoreService, private router: Router, private pathService: PathService, private route: ActivatedRoute) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(
      data => {
        this.ngOnInit();
      }
    )
    this.letter = decodeURIComponent(this.route.snapshot.params['letter']);
    this.route.params.subscribe(data => {
      this.letter = decodeURIComponent(data["letter"]);
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.coreletter = this.core.letters[this.letter];
    if (this.coreletter) {
      this.pathService.announcePage('JSMusicDB Next', this.coreletter);
      this.artists = this.coreletter.sortAndReturnArtistsBy('sortName', 'asc');
    }
  }
  onSelect(artist: any) {
    this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onSortChange(e:Event, sort: string) {
    this.artists = this.coreletter.sortAndReturnArtistsBy(sort, 'asc');
  }
}