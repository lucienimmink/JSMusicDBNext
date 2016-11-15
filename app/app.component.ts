import { Component, OnInit, ViewChild, OnDestroy, ViewContainerRef  } from "@angular/core";
import { musicdbcore } from './org/arielext/musicdb/core';
import { Observable } from 'rxjs/Observable';

import { CollectionService } from './collection.service';
import { CoreService } from './core.service';
import { PathService } from './utils/path.service';
import { PlayerService } from './player/player.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './utils/imagelazyloadarea.directive';
import { LastFMService } from './lastfm/lastfm.service';
import { LoginService } from './login/login.service';
import { Subscription } from 'rxjs/Subscription';
import { AnimationService } from './utils/animation.service';
import { ConfigService } from './utils/config.service';

// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';

@Component({
  selector: 'musicdb',
  templateUrl: 'app/app.component.html',
  providers: [CollectionService, CoreService, PathService, PlayerService, LastFMService, AnimationService, ConfigService]
})

export class AppComponent implements OnDestroy {
  private letter: string = 'N';
  private artists: Array<any>;
  private subscription: Subscription;
  private path: string = "JSMusicDB Next";
  private isLoading: boolean = false;
  private viewContainerRef: ViewContainerRef;
  constructor(private collectionService: CollectionService, private coreService: CoreService, private loginService: LoginService, private configService: ConfigService, private playerService: PlayerService, viewContainerRef:ViewContainerRef) {

    if (this.loginService.hasToken) {
      this.isLoading = true;
      this.getCollection();
    }
    this.configService.applyTheme();
    this.viewContainerRef = viewContainerRef;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
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
    this.isLoading = false;
  }

  onExternalPrev(event: Event): void {
    this.playerService.prev();
  }
  onExternalNext(event: Event): void {
    this.playerService.next();
  }
  onExternalToggle(event: Event): void {
    this.playerService.togglePlayPause();
  }
}
