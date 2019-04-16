import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
// import { ModalDirective } from 'ngx-bootstrap';

import { Playlist } from "../../playlists/playlist";
import { musicdbcore } from "./../../org/arielext/musicdb/core";
import Album from "./../../org/arielext/musicdb/models/Album";
import Track from "./../../org/arielext/musicdb/models/Track";
import { PlayerService } from "./../../player/player.service";
import { ConfigService } from "./../../utils/config.service";
import { CoreService } from "./../../utils/core.service";
import { PathService } from "./../../utils/path.service";

@Component({
  selector: "app-album-detail",
  templateUrl: "./album-detail.component.html"
})
export class AlbumDetailComponent implements OnInit, OnDestroy {
  public album: Album;
  public ownPlaylists: Playlist[] = [];
  public theme: string;
  private albumName = "";
  private artistName = "";
  private core: musicdbcore;
  private subscription: Subscription;
  private isSwiping = false;
  private isShrunk = false;
  private isFlacSupported = true;
  // @ViewChild('editModal') private editModal: ModalDirective;

  constructor(
    private coreService: CoreService,
    private router: Router,
    private pathService: PathService,
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private configService: ConfigService
  ) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
    this.artistName = decodeURIComponent(this.route.snapshot.params.artist);
    this.albumName = decodeURIComponent(this.route.snapshot.params.album);

    this.route.params.subscribe(data => {
      this.artistName = decodeURIComponent(data.artist);
      this.albumName = decodeURIComponent(data.album);
      this.ngOnInit();
    });

    this.theme = configService.mode;
  }

  public ngOnInit() {
    this.album = this.core.albums[this.artistName + "|" + this.albumName];
    if (this.album) {
      this.album.sortedDiscs = []; // reset

      const namedDiscs = Object.keys(this.album.discs);
      let discnrs: any[] = [];
      namedDiscs.forEach(name => {
        const discnr = name.substring(5);
        discnrs.push({
          nr: discnr,
          id: name
        });
      });
      discnrs = discnrs.sort((a, b) => {
        if (a.nr < b.nr) {
          return -1;
        }
        return 1;
      });
      discnrs.forEach(disc => {
        this.album.sortedDiscs.push(this.album.discs[disc.id]);
      });
      this.pathService.announcePath({
        artist: this.album.artist,
        album: this.album,
        letter: this.album.artist.letter
      });
    }

    // TODO this should a call from the backend
    this.ownPlaylists = [];
    if (localStorage.getItem("customlisttest")) {
      const list: Playlist[] = JSON.parse(localStorage.getItem("customlisttest"));
      if (list) {
        list.forEach(item => {
          const playlist = new Playlist();
          playlist.isOwn = true;
          playlist.name = item.name;
          playlist.tracks = item.tracks;

          this.ownPlaylists.push(playlist);
        });
      }
    }

    const mediaObject = document.querySelector("audio");
    const canPlayType = mediaObject.canPlayType("audio/flac");
    this.isFlacSupported = canPlayType === "probably" || canPlayType === "maybe";
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public onSelect(track: any, event: Event) {
    if (!this.isSwiping) {
      this.playerService.doPlayAlbum(this.album, this.album.tracks.indexOf(track), true, false);
    }
  }
  public navigateToArtist(artist: any) {
    this.router.navigate(["Artist", { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
  }
  public swipe(track: Track, state: boolean, event: Event): void {
    event.preventDefault();
    this.isSwiping = true;
    setTimeout(() => {
      this.isSwiping = false;
    }, 5);
    track.showActions = state;
  }
  public totalRunningTime(): number {
    let total = 0;
    this.album.tracks.forEach(track => {
      total += track.duration;
    });
    return total;
  }
}
