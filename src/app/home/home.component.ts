import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Router } from "@angular/router";
import { NgClass } from "@angular/common";
import { Subscription } from "rxjs/Subscription";

import { musicdbcore } from "./../org/arielext/musicdb/core";
import Artist from "../org/arielext/musicdb/models/Artist";
import Album from "./../org/arielext/musicdb/models/Album";
import Track from "./../org/arielext/musicdb/models/Track";
import { CollectionService } from "./../utils/collection.service";
import { CoreService } from "./../utils/core.service";
import { PathService } from "./../utils/path.service";
import { AlbumComponent } from "./../album/album/album.component";
import { BackgroundArtDirective } from "./../utils/background-art.directive";
import { RecentlyListenedService } from "./../utils/recently-listened.service";
import { LastfmService } from "./../utils/lastfm.service";
import { ConfigService } from "./../utils/config.service";
import { PlayerService } from "./../player/player.service";
import { User } from "./user";
//import * as PouchDB from 'pouchdb';
import PouchDB from 'pouchdb';

@Component({
  selector: 'mdb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [RecentlyListenedService]
})
export class HomeComponent implements OnInit {

  private recentlyListenedTable: any = new PouchDB("recentlyListened");
  
  private RECENTLYLISTENEDINTERVAL: number = 1000 * 60;

  private core: musicdbcore;
  public recentlyListenedTracks: Array<Track> = [];
  private newListenedTracks: Array<Track> = [];
  private counter: any;
  private loading: boolean = true;
  private subscription: Subscription;
  private subscription2: Subscription;
  private theme: string;
  private user: User;
  public username: string;
  private recentlyAdded: Array<Album> = [];

  // tslint:disable-next-line:max-line-length
  constructor(private playerService: PlayerService, private collectionService: CollectionService, private coreService: CoreService, private router: Router, private recentlyListened: RecentlyListenedService, private pathService: PathService, private lastFMService: LastfmService, private configService: ConfigService) {
    this.user = new User();

    this.subscription = this.configService.mode$.subscribe(
      data => {
        this.theme = data;
      }
    );
    this.core = this.coreService.getCore();
    this.subscription2 = this.core.coreParsed$.subscribe(
      data => {
        this.init(true);
      }
    );
    this.theme = configService.mode;
    this.pathService.announcePage("Home");

    if (localStorage.getItem("lastfm-username")) {
      this.username = localStorage.getItem("lastfm-username");
    }
    this.init();
  }

  ngOnInit() {

  }

  onSubmit(): void {

    this.lastFMService.authenticate({ user: this.user.name, password: this.user.password }).subscribe(
      data => {
        // save in storage
        localStorage.setItem("lastfm-token", data);
        localStorage.setItem("lastfm-username", this.user.name);
        // set in instance
        this.username = this.user.name;
        this.startPolling();
      }
    );
  }

  init(skipCoreCheck: boolean = false): void {
    if ((this.coreService.getCore().isCoreParsed || skipCoreCheck) && localStorage.getItem("lastfm-username")) {
      this.startPolling();
    }
    this.recentlyAdded = this.core.getLatestAdditions();
    let cachedlist = localStorage.getItem('cached-recently-listened');
    if (cachedlist) {
      this.recentlyListenedTracks = JSON.parse(cachedlist);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.counter);
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  startPolling(): void {
    if (!this.counter) {
      this.counter = setInterval(() => {
        this.checkRecentlyListened();
      }, this.RECENTLYLISTENEDINTERVAL);
      this.checkRecentlyListened();
    }
  }

  checkRecentlyListened(): void {
    this.newListenedTracks = [];
    this.loading = true;
    if (this.username !== "mdb-skipped") {
      this.recentlyListened.getRecentlyListened(this.username).subscribe(
        data => this.populate(data),
        error => console.log(error)
      );
    } else {
      this.recentlyListenedTable.get("recentlyListened", (err: any, data: any) => {
        if (data) {
          this.populate(data.tracks);
        }
        this.loading = false;
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
      return track.image[track.image.length - 1]["#text"];
    } else {
      return '';
    }
  }

  populate(json: any): void {
    json.forEach(fmtrack => {
      if (fmtrack.mbid) {
        let track:Track = new Track({});
        track.artist = fmtrack.artist["#text"];
        track.album = fmtrack.album["#text"];
        track.title = fmtrack.name;
        track.image = this.setImage(fmtrack);
        track.nowPlaying = (fmtrack["@attr"] && fmtrack["@attr"].nowplaying) ? true : false;
        track.date = this.setDate(fmtrack);
        track.trackArtist = fmtrack.artist["#text"];
        track.isPlaying = false;
        track.isPaused = false;
        track.isLoved = false;
        track.id = `${fmtrack.artist["#text"]}-${fmtrack.album["#text"]}-${fmtrack.name}`;
        this.newListenedTracks.push(track);
      }
    });
    if (this.recentlyListenedTracks !== this.newListenedTracks) {
      this.recentlyListenedTracks = this.newListenedTracks;
      let cachedlist: string = JSON.stringify(this.newListenedTracks);
      localStorage.setItem("cached-recently-listened", cachedlist);
    }
    this.loading = false;
  }
  skipLastfm(): void {
    let username: string = "mdb-skipped";
    localStorage.setItem("lastfm-username", username);
    this.username = username;
    this.startPolling();
  }
  playTrack(track: any): void {
    // get the track from the core;
    let artist: Artist = this.core.getArtistByName(track.artist);
    if (artist) {
      let album: Album = this.core.getAlbumByArtistAndName(artist, track.album);
      if (album) {
        let coretrack: Track = this.core.getTrackByAlbumAndName(album, track.title);
        if (coretrack) {
          this.playerService.doPlayTrack(coretrack);
          setTimeout(() => {
            this.checkRecentlyListened();
          }, 500);

        } else {
          console.warn('track not found', track);
        }
      } else {
        console.warn('album not found', track);
      }
    } else {
      console.warn('artist not found', track);
    }
  }
}