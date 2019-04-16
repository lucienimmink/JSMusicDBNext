import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { get, set } from "idb-keyval";
import { Subscription } from "rxjs";

import { musicdbcore } from "../../org/arielext/musicdb/core";
import Album from "../../org/arielext/musicdb/models/Album";
import Artist from "../../org/arielext/musicdb/models/Artist";
import Track from "../../org/arielext/musicdb/models/Track";
import { PlayerService } from "../../player/player.service";
import { CollectionService } from "../../utils/collection.service";
import { ConfigService } from "../../utils/config.service";
import { CoreService } from "../../utils/core.service";
import { LastfmService } from "../../utils/lastfm.service";
import { PathService } from "../../utils/path.service";
import { RecentlyListenedService } from "../../utils/recently-listened.service";
import { User } from "../user";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnDestroy {
  public recentlyListenedTracks: Track[] = [];
  public username: string;
  private RECENTLYLISTENEDINTERVAL: number = 1000 * 60;

  private core: musicdbcore;
  private newListenedTracks: Track[] = [];
  private counter: any;
  private loading = true;
  private subscription: Subscription;
  private subscription2: Subscription;
  private theme: string;
  private user: User;
  private recentlyAdded: Album[] = [];

  // tslint:disable-next-line:max-line-length
  constructor(
    private playerService: PlayerService,
    private collectionService: CollectionService,
    private coreService: CoreService,
    private router: Router,
    private recentlyListened: RecentlyListenedService,
    private pathService: PathService,
    private lastFMService: LastfmService,
    private configService: ConfigService
  ) {
    this.user = new User();

    this.subscription = this.configService.mode$.subscribe(data => {
      this.theme = data;
    });
    this.core = this.coreService.getCore();
    this.subscription2 = this.core.coreParsed$.subscribe(data => {
      this.init(true);
    });
    this.theme = configService.mode;
    this.pathService.announcePage("Home");

    if (localStorage.getItem("lastfm-username")) {
      this.username = localStorage.getItem("lastfm-username");
    }
    this.init();
  }

  public onSubmit(): void {
    this.lastFMService.authenticate({ user: this.user.name, password: this.user.password }).subscribe(data => {
      // save in storage
      localStorage.setItem("lastfm-token", data.session.key);
      localStorage.setItem("lastfm-username", this.user.name);
      // set in instance
      this.username = this.user.name;
      this.startPolling();
    });
  }

  public init(skipCoreCheck: boolean = false): void {
    if ((this.core.isCoreParsed || skipCoreCheck) && localStorage.getItem("lastfm-username")) {
      this.startPolling();
    }
    this.recentlyAdded = this.core.getLatestAdditions(14);
    get("cached-recently-listened").then((data: any) => {
      if (data) {
        this.populate(data);
      }
      this.loading = false;
    });
  }

  public ngOnDestroy(): void {
    clearInterval(this.counter);
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  public startPolling(): void {
    if (!this.counter) {
      this.counter = setInterval(() => {
        this.checkRecentlyListened();
      }, this.RECENTLYLISTENEDINTERVAL);
      this.checkRecentlyListened();
    }
  }

  public checkRecentlyListened(): void {
    this.newListenedTracks = [];
    this.loading = true;
    if (this.username !== "mdb-skipped") {
      this.recentlyListened.getRecentlyListened(this.username).subscribe(
        data => {
          set("cached-recently-listened", data.recenttracks.track);
          this.populate(data.recenttracks.track);
        },
        error => console.error(error)
      );
    } else {
      get("recentlyListened").then((data: any) => {
        if (data) {
          this.populate(data);
        }
        this.loading = false;
      });
    }
  }

  public setDate(track: any): Date {
    if (track["@attr"] && track["@attr"].nowplaying) {
      return new Date();
    } else {
      return new Date(Number(track.date.uts) * 1000);
    }
  }
  public setImage(track: any): string {
    if (track.image) {
      return track.image[track.image.length - 1]["#text"] || "/global/images/no-cover.png";
    }
    return "/global/images/no-cover.png";
  }

  public populate(json: any): void {
    this.newListenedTracks = [];
    json.forEach(fmtrack => {
      const track: Track = new Track({});
      track.artist = fmtrack.artist["#text"];
      track.album = fmtrack.album["#text"];
      track.title = fmtrack.name;
      track.image = this.setImage(fmtrack);
      track.nowPlaying = fmtrack["@attr"] && fmtrack["@attr"].nowplaying ? true : false;
      track.date = this.setDate(fmtrack);
      track.trackArtist = fmtrack.artist["#text"];
      track.isPlaying = false;
      track.isPaused = false;
      track.isLoved = false;
      track.id = `${fmtrack.artist["#text"]}-${fmtrack.album["#text"]}-${fmtrack.name}`;
      this.newListenedTracks.push(track);
    });
    if (this.recentlyListenedTracks !== this.newListenedTracks) {
      this.recentlyListenedTracks = this.newListenedTracks;
    }
    this.loading = false;
  }
  public skipLastfm(): void {
    const username = "mdb-skipped";
    localStorage.setItem("lastfm-username", username);
    this.username = username;
    this.startPolling();
  }
  public playTrack(track: any): void {
    // get the track from the core;
    const artist: Artist = this.core.getArtistByName(track.artist);
    if (artist) {
      const album: Album = this.core.getAlbumByArtistAndName(artist, track.album);
      if (album) {
        const coretrack: Track = this.core.getTrackByAlbumAndName(album, track.title);
        if (coretrack) {
          this.playerService.doPlayTrack(coretrack);
          setTimeout(() => {
            this.checkRecentlyListened();
          }, 500);
        } else {
          console.warn("track not found", track);
        }
      } else {
        console.warn("album not found", track);
      }
    } else {
      console.warn("artist not found", track);
    }
  }
}
