import { Component, OnInit, ViewChild } from "@angular/core";
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { musicdbcore } from './org/arielext/musicdb/core';
import { Observable } from 'rxjs/Observable';

import { CollectionService } from './collection.service';
import { CoreService } from './core.service';
import { LetterComponent } from './letter/letter.component';
import { LetterDetailComponent } from './letter/letterdetail.component';
import { ArtistDetailComponent } from './artist/artistdetail.component';
import { AlbumDetailComponent } from './album/albumdetail.component';
import { TopMenuComponent } from './menu/topmenu.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { PathService } from './utils/path.service';
import { PlayerService } from './player/player.service';
import { PlayerComponent } from './player/player.component';
import { NowPlayingComponent } from './nowPlaying/nowPlaying.component';

// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';


@Component({
  selector: 'musicdb',
  templateUrl: 'app/app.component.html',
  providers: [CollectionService, CoreService, PathService, PlayerService ],
  directives: [LetterComponent, ROUTER_DIRECTIVES, TopMenuComponent, PlayerComponent ]
})
@RouteConfig([
  { path: '/home', name: 'Home', component: HomeComponent},
  { path: '/now playing', name: 'Now playing', component: NowPlayingComponent},
  { path: '/settings', name: 'Settings', component: SettingsComponent},
  { path: '/letter/:letter', name: 'Letter', component: LetterDetailComponent },
  { path: '/letter/:letter/artist/:artist', name: 'Artist', component: ArtistDetailComponent },
  { path: '/letter/:letter/artist/:artist/album/:album', name: 'Album', component: AlbumDetailComponent }
])
export class AppComponent implements OnInit {
  private letter: string = 'N';
  private artists: Array<any>;

  private path:string = "JSMusicDB Next";

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