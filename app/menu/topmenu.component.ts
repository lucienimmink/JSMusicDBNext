import { Component, OnDestroy  } from "@angular/core";
import { PathService } from "./../utils/path.service";
import { Subscription }   from 'rxjs/Subscription';

@Component({
  templateUrl: 'app/menu/topmenu.component.html',
  selector: 'topmenu',
  styleUrls: [ 'app/menu/topmenu.component.css' ]
})

export class TopMenuComponent implements OnDestroy {
    path:string;
    subscription:Subscription;

    constructor(pathService:PathService) {
      // subscribe to a change in path; so we can display it
      this.subscription = pathService.pathAnnounced$.subscribe(
        path => {
          this.path = path;
        }
      );
    }

    ngOnDestroy() {
      this.subscription.unsubscribe(); // prevent memory leakage
    }
}