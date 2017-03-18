import { Component, OnInit, OnDestroy, Input, AfterViewChecked, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { PathService } from './../utils/path.service';
import { CoreService } from './../core.service';
import { CollectionService } from './../collection.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { TimeFormatPipe } from './../timeformat.pipe';
import { LastFMService } from './../lastfm/lastfm.service';
import { ConfigService } from './../utils/config.service';
import { Settings } from './settings';

import { Subscription } from 'rxjs/Subscription';

const VERSION = "__dev__";

@Component({
    templateUrl: 'app/settings/settings.component.html',
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
    private savePlaylistState: boolean = this.booleanState("save-playlist-state");
    private manualScrobbling: boolean = this.booleanState('manual-scrobble-state');
    private isContinuesplay: boolean = this.booleanState('continues-play');
    private manualScrobblingList: Array<any> = JSON.parse(localStorage.getItem('manual-scrobble-list')) || [];
    private isReloading: boolean = false;
    private scanperc: number = 0;
    private version: String = VERSION;
    private settings: Settings;
    private hasBeenReloading: boolean = false;
    private lastParsed: number = Number(localStorage.getItem('lastParsed'));

    private visualisation: boolean = this.booleanState('visualisation-state');

    private themeForm: NgForm;
    @ViewChild('themeForm') currentForm: NgForm;
    private theme: string;

    constructor(private pathService: PathService, private coreService: CoreService, private lastFMService: LastFMService, private collectionService: CollectionService, private router: Router, private configService: ConfigService) {
        this.settings = new Settings();
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
                this.settings.theme = data;
                this.theme = data;
            }
        )
        // setup a form for changing stuff
        this.settings.theme = this.configService.theme;
        this.theme = this.settings.theme;

        // check if the collection is in reloading state
        this.poll();
    }

    private booleanState(key: string): boolean {
        let raw = localStorage.getItem(key);
        if (raw && raw === 'true') {
            return true;
        }
        return false;
    }
    ngAfterViewChecked() {
        this.formChanged();
    }
    formChanged() {
        if (this.currentForm === this.themeForm) { return; }
        this.themeForm = this.currentForm;
        if (this.themeForm) {
            this.themeForm.valueChanges.subscribe(data => {
                if (data && data.theme) {
                    this.configService.theme = data.theme;
                    this.theme = data.theme;
                }
            });
        }
    }

    ngOnInit() {
        this.pathService.announcePage('Settings');
        this.totals = this.core.totals;
        this.lastfmusername = localStorage.getItem("lastfm-username") || '';
        this.connectiondetails = localStorage.getItem('dsm');
        this.manualScrobblingList = JSON.parse(localStorage.getItem('manual-scrobble-list'));
        this.lastParsed = Number(localStorage.getItem('lastParsed'));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription2.unsubscribe();
        this.subscription3.unsubscribe();
    }

    removeLastfm() {
        localStorage.removeItem('lastfm-username');
        localStorage.removeItem('lastfm-token');
        this.ngOnInit();
    }
    removeConnection() {
        localStorage.removeItem("jwt");
        localStorage.removeItem('dsm');
        this.ngOnInit();
    }
    toggleSavePlaylistState() {
        this.savePlaylistState = !this.savePlaylistState;
        localStorage.setItem('save-playlist-state', this.savePlaylistState.toString());
    }
    toggleContinuesPlay() {
        this.isContinuesplay = !this.isContinuesplay;
        localStorage.setItem('continues-play', this.isContinuesplay.toString());
    }
    toggleManualScrobbling() {
        this.manualScrobbling = !this.manualScrobbling;
        localStorage.setItem('manual-scrobble-state', this.manualScrobbling.toString());
        this.manualScrobblingList = JSON.parse(localStorage.getItem('manual-scrobble-list'));
    }
    toggleVisualisation() {
        this.visualisation = !this.visualisation;
        localStorage.setItem('visualisation-state', this.visualisation.toString());
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
            if (Object.is(value, item)) {
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
                setTimeout(e => {
                    this.poll();
                }, 300);
            }
        )
    }
    poll() {
        this.collectionService.poll().subscribe(
            data => {
                this.scanperc = data.progress
                if (data.status !== 'ready') {
                    this.isReloading = true;
                    setTimeout(e => {
                        this.poll();
                    }, 300);
                    this.hasBeenReloading = true;
                } else {
                    this.isReloading = false;
                    if (this.hasBeenReloading) {
                        this.getCollection();
                    }
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
        this.hasBeenReloading = false;
        this.coreService.getCore().parseSourceJson(data);
    }

    viewList() {
        this.router.navigate(['/scrobble-cache']);
    }
}
