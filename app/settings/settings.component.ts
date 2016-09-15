import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Router } from '@angular/router';
import { PathService } from './../utils/path.service';
import { CoreService } from './../core.service';
import { CollectionService } from './../collection.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { TimeFormatPipe } from './../timeformat.pipe';
import { LastFMService } from './../lastfm/lastfm.service';
import { ConfigService } from './../utils/config.service';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormControl, Validators } from '@angular/forms';

import { Subscription }   from 'rxjs/Subscription';

import * as _ from 'lodash';

const VERSION = "__dev__";

@Component({
    templateUrl: 'app/settings/settings.component.html',
    pipes: [TimeFormatPipe],
    directives: [REACTIVE_FORM_DIRECTIVES],
    styleUrls: ['dist/settings/settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

    private totals: any;
    private core: musicdbcore;
    private lastfmusername: string;
    private connectiontype: string = "node-mp3stream"; // we can implement more connection types later on (dsm, local, etc)
    private connectiondetails: string = "";
    private subscription: Subscription;
    private subscription2: Subscription;
    private subscription3: Subscription;
    private subscription4: Subscription;
    private savePlaylistState: boolean = this.booleanState("save-playlist-state");
    private manualScrobbling: boolean = this.booleanState('manual-scrobble-state');
    private manualScrobblingList: Array<any> = JSON.parse(localStorage.getItem('manual-scrobble-list')) || [];
    private isReloading: boolean = false;
    private scanperc: number = 0;
    private form: FormGroup;
    private version:String = VERSION;
    @Input() private theme: string;

    constructor(private pathService: PathService, private coreService: CoreService, private lastFMService: LastFMService, private collectionService: CollectionService, private router: Router, private configService: ConfigService) {
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
        this.subscription3 = this.configService.theme$.subscribe(
            data => {
                this.theme = data;
            }
        )
        this.theme = configService.theme;

        // setup a form for changing stuff
        let controls:any = {};
        controls['theme'] = new FormControl(configService.theme);
        this.form = new FormGroup(controls);

        // subscribe to the form's change event for instant changing the settings
        this.subscription4 = this.form.valueChanges.subscribe(
            data => this.configService.theme = data.theme
        );
    }

    private booleanState(key: string): boolean {
        let raw = localStorage.getItem(key);
        if (raw && raw === 'true') {
            return true;
        }
        return false;
    }

    ngOnInit() {
        this.pathService.announcePage('Settings');
        this.totals = this.core.totals;
        this.lastfmusername = localStorage.getItem("lastfm-username") || '';
        this.connectiondetails = localStorage.getItem('dsm');
        this.manualScrobblingList = JSON.parse(localStorage.getItem('manual-scrobble-list'));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription2.unsubscribe();
        this.subscription3.unsubscribe();
        this.subscription4.unsubscribe();
    }

    removeLastfm() {
        localStorage.removeItem('lastfm-username');
        localStorage.removeItem('lastfm-token');
        this.ngOnInit();
    }
    removeConnection() {
        localStorage.removeItem("jwt");
        this.ngOnInit();
    }
    toggleSavePlaylistState() {
        this.savePlaylistState = !this.savePlaylistState;
        localStorage.setItem('save-playlist-state', this.savePlaylistState.toString());
    }
    toggleManualScrobbling() {
        this.manualScrobbling = !this.manualScrobbling;
        localStorage.setItem('manual-scrobble-state', this.manualScrobbling.toString());
        this.manualScrobblingList = JSON.parse(localStorage.getItem('manual-scrobble-list'));
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
    reloadCollection() {
        this.isReloading = true;
        this.collectionService.reload().subscribe(
            data => {
                this.poll();
            }
        )
    }
    poll() {
        let c = this;
        this.collectionService.poll().subscribe(
            data => {
                this.scanperc = data.progress
                if (data.status !== 'ready') {
                    this.isReloading = true;
                    setTimeout(e => {
                        this.poll();
                    }, 300);
                } else {
                    this.isReloading = false;
                    this.getCollection();
                }
            }
        )
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

    viewList() {
        this.router.navigate(['ScrobbleCache']);
    }
}
