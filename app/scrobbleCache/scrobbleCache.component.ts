import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { PathService } from './../utils/path.service';
import { CoreService } from './../core.service';
import { CollectionService } from './../collection.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { TimeFormatPipe } from './../timeformat.pipe';
import { LastFMService } from './../lastfm/lastfm.service';
import { StickyDirective } from './../utils/sticky.directive';
import { Subscription }   from 'rxjs/Subscription';

import * as _ from 'lodash';

@Component({
    templateUrl: 'app/scrobbleCache/scrobbleCache.component.html',
    pipes: [TimeFormatPipe],
    directives: [StickyDirective],
    styleUrls: ['app/scrobbleCache/scrobbleCache.component.css']
})
export class ScrobbleCacheComponent implements OnInit, OnDestroy {

    private core: musicdbcore;
    private subscription: Subscription;
    private subscription2: Subscription;
    private manualScrobbling: boolean = this.booleanState('manual-scrobble-state');
    private manualScrobblingList: Array<any> = JSON.parse(localStorage.getItem('manmual-scrobble-list')) || [];
    private isReloading: boolean = false;

    constructor(private pathService: PathService, private coreService: CoreService, private lastFMService: LastFMService, private collectionService: CollectionService, private router: Router) {
        this.core = this.coreService.getCore();
        this.subscription = this.core.coreParsed$.subscribe(
            data => {
                this.ngOnInit();
            }
        )
        this.subscription2 = this.lastFMService.manualScrobbleList$.subscribe(
            data => {
                this.manualScrobblingList = data;
            }
        )
    }

    private booleanState(key: string): boolean {
        let raw = localStorage.getItem(key);
        if (raw && raw === 'true') {
            return true;
        }
        return false;
    }

    ngOnInit() {
        this.pathService.announcePage('Scrobble cache');
        this.manualScrobblingList = JSON.parse(localStorage.getItem('manual-scrobble-list'));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription2.unsubscribe();
    }

    scrobbleNow() {
        this.manualScrobblingList = JSON.parse(localStorage.getItem('manual-scrobble-list'));
        let track = this.manualScrobblingList.pop();
        this.lastFMService.scrobbleCachedTrack(track).subscribe(
            data => {
                localStorage.setItem('manual-scrobble-list', JSON.stringify(this.manualScrobblingList));
                if (this.manualScrobblingList.length > 0) {
                    this.scrobbleNow();
                }
            }
        )
    }
    removeFromScrobbleList(item: any) {
        this.manualScrobblingList = JSON.parse(localStorage.getItem('manual-scrobble-list'));
        let index = -1;
        this.manualScrobblingList.forEach(function (value, i) {
            if (_.isEqual(value, item)) {
                index = i;
            }
        })
        this.manualScrobblingList.splice(index, 1);
        localStorage.setItem('manual-scrobble-list', JSON.stringify(this.manualScrobblingList));
    }
}