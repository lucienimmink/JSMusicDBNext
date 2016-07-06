import { Component, OnDestroy, Input  } from "@angular/core";
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { PathService } from "./../utils/path.service";
import { Subscription }   from 'rxjs/Subscription';
import { TOOLTIP_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: 'app/menu/topmenu.component.html',
  selector: 'topmenu',
  styleUrls: ['app/menu/topmenu.component.css'],
  directives: [ROUTER_DIRECTIVES, TOOLTIP_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})

export class TopMenuComponent implements OnDestroy {
  path: string;
  subscription: Subscription;
  page: string;
  subscription2: Subscription;
  menuVisible: boolean = false;
  @Input() query:string;
  private form: FormGroup;
  private topSearchVisible: boolean = false;

  constructor(private pathService: PathService, private router:Router) {
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

    let controls:any = {};
    controls['query'] = new FormControl('');
    this.form = new FormGroup(controls);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // prevent memory leakage
    this.subscription2.unsubscribe();
  }
  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }
  onSubmit() {
      let query = this.form.value.query;
      this.topSearchVisible = false;
      this.menuVisible = false;
      this.router.navigate(['Search', { query: query }]);
  }
  toggleSearch() {
      this.topSearchVisible = !this.topSearchVisible;
  }
}