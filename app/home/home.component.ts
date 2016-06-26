import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { NgClass } from '@angular/common';
import { musicdbcore } from './../org/arielext/musicdb/core';
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import { AuthHttp } from 'angular2-jwt';
import * as _ from 'lodash';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormControl, Validators } from '@angular/forms';

import { CollectionService } from './../collection.service';
import { CoreService } from './../core.service';
import { PathService } from './../utils/path.service';
import { AlbumComponent } from './../album/album.component';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { RecentlyListenedService } from './../utils/recentlyListened.service';
import { LastFMService } from './../lastfm/lastfm.service';

const RECENTLYLISTENEDINTERVAL = 1000 * 60;

@Component({
  templateUrl: 'app/home/home.component.html',
  selector: 'home',
  styleUrls: ['dist/home/home.component.css'],
  directives: [REACTIVE_FORM_DIRECTIVES],
  providers: [RecentlyListenedService, LastFMService]
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

  constructor(private collectionService: CollectionService, private coreService: CoreService, private router: Router, private recentlyListened: RecentlyListenedService, private pathService: PathService, public authHttp: AuthHttp, private lastFMService: LastFMService) {
    let controls: any = {};
    controls['username'] = new FormControl('', Validators.required);
    controls['password'] = new FormControl('', Validators.required);
    this.form = new FormGroup(controls);
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
  }

  startPolling() {
    let c = this;
    this.counter = setInterval(function () {
      c.checkRecentlyListened();
    }, RECENTLYLISTENEDINTERVAL);
    this.checkRecentlyListened();
  }

  checkRecentlyListened() {
    // this.recentlyListenedTracks = [];
    this.newListenedTracks = [];
    this.loading = true;
    this.recentlyListened.getRecentlyListened(this.username).subscribe(
      data => this.populate(data),
      error => console.log(error)
    )
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
    return _.last(track.image)["#text"];
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

};