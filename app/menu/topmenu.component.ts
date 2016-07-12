import { Component, OnDestroy, Input  } from "@angular/core";
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { PathService } from "./../utils/path.service";
import { Subscription }   from 'rxjs/Subscription';
import { TOOLTIP_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormControl, Validators } from '@angular/forms';
import { LastFMService } from './../lastfm/lastfm.service';

@Component({
    templateUrl: 'app/menu/topmenu.component.html',
    selector: 'topmenu',
    styleUrls: ['dist/menu/topmenu.component.css', 'dist/menu/side-nav.css'],
    directives: [ROUTER_DIRECTIVES, TOOLTIP_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})

export class TopMenuComponent implements OnDestroy {
    path: string;
    subscription: Subscription;
    page: string;
    subscription2: Subscription;
    subscription3: Subscription;
    subscription4: Subscription;
    menuVisible: boolean = false;
    @Input() query: string;
    private form: FormGroup;
    private topSearchVisible: boolean = false;
    private manualScrobblingList: Array<any> = JSON.parse(localStorage.getItem('manual-scrobble-list')) || [];
    private theme: String;

    constructor(private pathService: PathService, private router: Router, private lastFMService: LastFMService) {
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
        this.subscription3 = this.lastFMService.manualScrobbleList$.subscribe(
            data => {
                this.manualScrobblingList = data;
            }
        )
        let controls: any = {};
        controls['query'] = new FormControl('');
        this.form = new FormGroup(controls);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe(); // prevent memory leakage
        this.subscription2.unsubscribe();
    }
    toggleMenu() {
        this.menuVisible = !this.menuVisible;
        if (this.menuVisible) {
            this.slideOut();
        } else {
            this.slideIn();
        }
    }
    slideOut() {
        let sideNavEl = document.querySelector('.js-side-nav');
        sideNavEl.classList.add('side-nav--animatable');
        sideNavEl.classList.add('side-nav--visible');
        document.addEventListener('click', this.onDocumentClick);
        sideNavEl.addEventListener('transitionend', this.onTransitionEnd);
    }
    slideIn() {
        let sideNavEl = document.querySelector('.js-side-nav');
        sideNavEl.classList.add('side-nav--animatable');
        sideNavEl.classList.remove('side-nav--visible');
        document.removeEventListener('click', this.onDocumentClick);
        //this.detabinator.inert = true;
        sideNavEl.addEventListener('transitionend', this.onTransitionEnd);
    }
    onTransitionEnd(evt) {
        let sideNavEl = document.querySelector('.js-side-nav');
        sideNavEl.classList.remove('side-nav--animatable');
        sideNavEl.removeEventListener('transitionend', this.onTransitionEnd);
    }
    onSubmit() {
        let query = this.form.value.query;
        this.topSearchVisible = false;
        if (this.menuVisible) {
            this.toggleMenu();
        }
        this.router.navigate(['Search', { query: query }]);
    }
    toggleSearch() {
        this.topSearchVisible = !this.topSearchVisible;
    }
    private onDocumentClick = (e:Event) => {
        let target = <HTMLElement>e.target;
        if (target.classList.contains("side-nav--visible")) {
            this.toggleMenu();
        }
    }
}
