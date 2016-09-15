import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { musicdbcore } from './../org/arielext/musicdb/core';
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import * as _ from 'lodash';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CollectionService } from './../collection.service';
import { CoreService } from './../core.service';
import { PathService } from './../utils/path.service';
import { AlbumComponent } from './../album/album.component';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { RecentlyListenedService } from './../utils/recentlyListened.service';
import { LastFMService } from './../lastfm/lastfm.service';
import { ConfigService } from './../utils/config.service';

import { Subscription }   from 'rxjs/Subscription';

import * as PouchDB from 'pouchdb';

let recentlyListenedTable = new PouchDB('recentlyListened');

const RECENTLYLISTENEDINTERVAL = 1000 * 60;

@Component({
    templateUrl: 'app/home/home.component.html',
    selector: 'home',
    styleUrls: ['dist/home/home.component.css'],
    providers: [RecentlyListenedService]
})
export class HomeComponent implements OnInit, OnDestroy {

    private core: musicdbcore;
    private recentlyListenedTracks: Array<Track> = [];
    private newListenedTracks: Array<Track> = [];
    private counter: any;
    private loading: boolean = true;
    @Input() username: string;
    @Input() password: string;
    private form: FormGroup;
    private subscription: Subscription;
    private theme: string;
    private recentlyListenedTable = recentlyListenedTable;

    constructor(private collectionService: CollectionService, private coreService: CoreService, private router: Router, private recentlyListened: RecentlyListenedService, private pathService: PathService, private lastFMService: LastFMService, private configService: ConfigService) {
        let controls: any = {};
        controls['username'] = new FormControl('', Validators.required);
        controls['password'] = new FormControl('', Validators.required);
        this.form = new FormGroup(controls);

        this.subscription = this.configService.theme$.subscribe(
            data => {
                this.theme = data;
            }
        )
        this.theme = configService.theme;
    }

    onSubmit() {

        this.lastFMService.authenticate({ user: this.form.value.username, password: this.form.value.password }).subscribe(
            data => {
                // save in storage
                localStorage.setItem('lastfm-token', data);
                localStorage.setItem('lastfm-username', this.form.value.username);
                // set in instance
                this.username = this.form.value.username;
                this.startPolling();
            }
        )
    }

    ngOnInit() {
        this.core = this.coreService.getCore();
        if (localStorage.getItem('lastfm-username')) {
            this.username = localStorage.getItem('lastfm-username');
            this.startPolling();
        }
        this.pathService.announcePage('Home');
    }

    ngOnDestroy() {
        clearInterval(this.counter);
        this.subscription.unsubscribe();
    }

    startPolling() {
        let c = this;
        this.counter = setInterval(function () {
            c.checkRecentlyListened();
        }, RECENTLYLISTENEDINTERVAL);
        this.checkRecentlyListened();
    }

    checkRecentlyListened() {
        this.newListenedTracks = [];
        this.loading = true;
        if (this.username !== "mdb-skipped") {
            this.recentlyListened.getRecentlyListened(this.username).subscribe(
                data => this.populate(data),
                error => console.log(error)
            )
        } else {
            let c = this;
            this.recentlyListenedTable.get('recentlyListened', function (err, data) {
                if (data) {
                    c.populate(data.tracks);
                }
                c.loading = false;
            });
        }
    }

    setDate(track: any): Date {
        if (track["@attr"] && track["@attr"].nowplaying) {
            return new Date();
        } else {
            return new Date(Number(track.date.uts) * 1000);
        }
    }
    setImage(track: any): String {
        // last one is the best possible quality
        if (track.image) {
            return _.last(track.image)["#text"];
        } else {
            return '';
        }
    }

    populate(json: any): void {
        var c: any = this;
        _.each(json, function (fmtrack) {
            var track = {
                artist: fmtrack.artist["#text"],
                album: fmtrack.album["#text"],
                title: fmtrack.name,
                image: c.setImage(fmtrack),
                nowPlaying: (fmtrack["@attr"] && fmtrack["@attr"].nowplaying) ? true : false,
                date: c.setDate(fmtrack)
            }
            c.newListenedTracks.push(track);
        });
        if (this.recentlyListenedTracks !== this.newListenedTracks) {
            this.recentlyListenedTracks = this.newListenedTracks;
        }
        this.loading = false;
    }
    skipLastfm(): void {
        let username = "mdb-skipped";
        localStorage.setItem('lastfm-username', username);
        this.username = username;
        this.startPolling();
    }

};