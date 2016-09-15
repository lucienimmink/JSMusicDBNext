import { Component, OnInit, ViewChild, OnDestroy, NgModule } from "@angular/core";
import { musicdbcore } from './org/arielext/musicdb/core';
import { Observable } from 'rxjs/Observable';

import { CollectionService } from './collection.service';
import { CoreService } from './core.service';
import { PathService } from './utils/path.service';
import { PlayerService } from './player/player.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './utils/imagelazyloadarea.directive';
import { LoggedInRouterOutlet } from './LoggedInOutlet';
import { LastFMService} from './lastfm/lastfm.service';
import { LoginService } from './login/login.service';
import { Subscription }   from 'rxjs/Subscription';
import { AnimationService } from './utils/animation.service';
import { ConfigService } from './utils/config.service';

// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';

@NgModule({
  declarations: [ IMAGELAZYLOAD_DIRECTIVE, LoggedInRouterOutlet ]
})
@Component({
  selector: 'musicdb',
  templateUrl: 'app/app.component.html',
  providers: [CollectionService, CoreService, PathService, PlayerService, LoginService, LastFMService, AnimationService, ConfigService]
})

export class AppComponent implements OnDestroy {
  private letter: string = 'N';
  private artists: Array<any>;
  private subscription: Subscription;
  private path: string = "JSMusicDB Next";
  constructor(private collectionService: CollectionService, private coreService: CoreService, private loginService: LoginService, private configService: ConfigService, private playerService: PlayerService) {
    if (localStorage.getItem('jwt')) {
      // lets login with these credentials
      this.loginService.autoLogin().subscribe(
        data => {
          this.getCollection();
        }
      )
    }
    this.configService.applyTheme();
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
