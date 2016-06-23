import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { NgClass } from '@angular/common';
import { musicdbcore } from './../org/arielext/musicdb/core';
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import { AuthHttp } from 'angular2-jwt';
import * as _ from 'lodash';

import { CollectionService } from './../collection.service';
import { CoreService } from './../core.service';
import { PathService } from './../utils/path.service';
import { AlbumComponent } from './../album/album.component';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { RecentlyListenedService } from './../utils/recentlyListened.service';

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

  constructor(private collectionService: CollectionService, private coreService: CoreService, private router: Router, private recentlyListened: RecentlyListenedService, private pathService: PathService, public authHttp: AuthHttp) { }

  ngOnInit() {
    let c = this;
    this.core = this.coreService.getCore();

    this.counter = setInterval(function () {
      c.checkRecentlyListened();
    }, RECENTLYLISTENEDINTERVAL);
    this.checkRecentlyListened();
    this.pathService.announcePage('Home');
    this.getCollection();
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

  ngOnDestroy() {
    clearInterval(this.counter);
  }

  checkRecentlyListened() {
    // this.recentlyListenedTracks = [];
    this.newListenedTracks = [];
    this.loading = true;
    this.recentlyListened.getRecentlyListened('arielext').subscribe(
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

  onSelect(album: any) {
    this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
  }
};