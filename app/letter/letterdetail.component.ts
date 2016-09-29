import { Component, OnInit, OnDestroy, NgModule } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';
import { ArtistComponent } from './../artist/artist.component';
import { PathService } from './../utils/path.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './../utils/imagelazyloadarea.directive';
import { Subscription }   from 'rxjs/Subscription';

@NgModule({
  declarations: [ ArtistComponent, IMAGELAZYLOAD_DIRECTIVE ]
})
@Component({
  templateUrl: 'app/letter/letterdetail.component.html',
  styleUrls: [ 'dist/letter/letterdetail.component.css' ]
})

export class LetterDetailComponent implements OnInit, OnDestroy {
  private letter:string;
  private artists:Array<any> = [];
  private core:musicdbcore;
  private subscription: Subscription;

  constructor (private coreService: CoreService, private router: Router, private pathService: PathService, private route: ActivatedRoute) {
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
    let coreletter = this.core.letters[this.letter];
    if (coreletter) {
      coreletter.active = true;
      this.pathService.announcePage('JSMusicDB Next');
      this.artists = coreletter.sortAndReturnArtistsBy('name', 'asc');
    }
  }
  onSelect(artist:any) {
    this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}