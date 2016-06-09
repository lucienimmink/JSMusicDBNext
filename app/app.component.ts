import { Component, OnInit, ViewChild } from "@angular/core";
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { musicdbcore } from './org/arielext/musicdb/core';
import { Observable } from 'rxjs/Observable';

import { CollectionService } from './collection.service';
import { CoreService } from './core.service';
import { LetterComponent } from './letter.component';
import { LetterDetailComponent } from './letter/letterdetail.component';
import { ArtistDetailComponent } from './artist/artistdetail.component';
import { AlbumDetailComponent } from './album/albumdetail.component';

// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';


@Component({
  selector: 'musicdb',
  templateUrl: 'app/app.component.html',
  providers: [CollectionService, CoreService],
  directives: [LetterComponent, ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/letter/:letter', name: 'Letter', component: LetterDetailComponent },
  { path: '/letter/:letter/artist/:artist', name: 'Artist', component: ArtistDetailComponent },
  { path: '/letter/:letter/artist/:artist/album/:album', name: 'Album', component: AlbumDetailComponent }
])
export class AppComponent implements OnInit {
  private letter: string = 'N';
  private artists: Array<any>;

  @ViewChild(LetterComponent)
  private letterComponent:LetterComponent;

  constructor(private collectionService: CollectionService, private coreService: CoreService) { }

  ngOnInit() {
    this.getCollection();
  }

  getCollection() {
    this.collectionService.getCollection()
      .subscribe(
      data => this.fillCollection(data),
      error => console.log(error)
      );
  }
  fillCollection(data: any): void {
    this.coreService.getCore().parseSourceJson(data);
    this.letterComponent.ngOnInit();
  }
}