import { Component, OnDestroy  } from "@angular/core";
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { PathService } from "./../utils/path.service";
import { Subscription }   from 'rxjs/Subscription';

@Component({
  templateUrl: 'app/menu/topmenu.component.html',
  selector: 'topmenu',
  styleUrls: [ 'app/menu/topmenu.component.css' ],
  directives: [ROUTER_DIRECTIVES]
})

export class TopMenuComponent implements OnDestroy {
    path:string;
    subscription:Subscription;
    page:string;
    subscription2:Subscription;
    menuVisible:boolean = false;

    constructor(pathService:PathService) {
      // subscribe to a change in path; so we can display it
      this.subscription = pathService.pathAnnounced$.subscribe(
        path => {
          this.path = path;
        }
      );
      this.subscription2 = pathService.pageAnnounced$.subscribe(
        page => { this.page = page }
      );
    }

    ngOnDestroy() {
      this.subscription.unsubscribe(); // prevent memory leakage
      this.subscription2.unsubscribe();
    }
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    }
}