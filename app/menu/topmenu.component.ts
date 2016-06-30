import { Component, OnDestroy  } from "@angular/core";
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { PathService } from "./../utils/path.service";
import { Subscription }   from 'rxjs/Subscription';
import { TOOLTIP_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  templateUrl: 'app/menu/topmenu.component.html',
  selector: 'topmenu',
  styleUrls: ['app/menu/topmenu.component.css'],
  directives: [ROUTER_DIRECTIVES, TOOLTIP_DIRECTIVES]
})

export class TopMenuComponent implements OnDestroy {
  path: string;
  subscription: Subscription;
  page: string;
  subscription2: Subscription;
  menuVisible: boolean = false;

  constructor(pathService: PathService) {
    // subscribe to a change in path; so we can display it
    this.subscription = pathService.pathAnnounced$.subscribe(
      path => {
        this.path = path;
        this.page = null;
        this.menuVisible = false;
      }
    );
    this.subscription2 = pathService.pageAnnounced$.subscribe(
      page => {
        this.page = page;
        this.path = null;
        this.menuVisible = false;
      }
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