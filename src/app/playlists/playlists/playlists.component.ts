import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
// import { ModalDirective } from 'ngx-bootstrap';

import { musicdbcore } from "./../../org/arielext/musicdb/core";
import Artist from "./../../org/arielext/musicdb/models/Artist";
import Track from "./../../org/arielext/musicdb/models/Track";
import { PlayerService } from "./../../player/player.service";
import { ConfigService } from "./../../utils/config.service";
import { CoreService } from "./../../utils/core.service";
import { LastfmService } from "./../../utils/lastfm.service";
import { PathService } from "./../../utils/path.service";
import { Playlist } from "./../playlist";
import { PlaylistService } from "./../playlist.service";

@Component({
  selector: "app-playlists",
  templateUrl: "./playlists.component.html"
})
export class PlaylistsComponent implements OnInit, OnDestroy {
  public playlist: Playlist;
  public currentPlaylist: any;
  public loading = false;
  public username: string = localStorage.getItem("lastfm-username");
  public showStartingArtist = false;
  // @ViewChild('addModal') private addModal: ModalDirective;
  // @ViewChild('editModal') private editModal: ModalDirective;
  public ownPlaylists: Playlist[] = [];
  private subscription: Subscription;
  private subscription2: Subscription;
  private newPlaylist: Playlist;
  private track: Track;
  private trackIndex: number;
  private core: musicdbcore;
  private artists: Artist[] = [];
  private startingArtistName: string;
  private theme: string;

  constructor(
    private pathService: PathService,
    private coreService: CoreService,
    private router: Router,
    private playerService: PlayerService,
    private lastfmservice: LastfmService,
    private configService: ConfigService,
    public playlistService: PlaylistService
  ) {
    // this is for when we open the page; just wanting to know the current state of the playerService
    const playerData = this.playerService.getCurrentPlaylist();
    if (playerData) {
      this.currentPlaylist = playerData.playlist;
      this.trackIndex = playerData.startIndex;
      this.setTrack();
    }
    // this is for when a new track is announced while we are already on the page
    this.subscription = this.playerService.playlistAnnounced$.subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      playerData => {
        this.currentPlaylist = playerData.playlist;
        this.trackIndex = playerData.startIndex;
        this.setTrack();
      }
    );
    this.core = this.coreService.getCore();
    this.subscription2 = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
    this.theme = configService.mode;
    this.newPlaylist = new Playlist();
  }

  public setTrack() {
    this.track = this.currentPlaylist.tracks[this.trackIndex];
    if (this.track) {
      this.track.position = 0;
    }
  }

  public ngOnInit() {
    this.pathService.announcePage("Playlists");
    this.artists = this.core.artistsList();
    this.ownPlaylists = [];

    // TODO this should a call from the backend
    if (localStorage.getItem("customlisttest")) {
      const list: any[] = JSON.parse(localStorage.getItem("customlisttest"));
      if (list) {
        list.forEach(item => {
          const playlist = new Playlist();
          playlist.name = item.name;
          playlist.isOwn = true;
          item.tracks.forEach(id => {
            const track: Track = this.core.getTrackById(id);
            if (track && track.title) {
              playlist.tracks.push(track);
            }
          });

          this.ownPlaylists.push(playlist);
        });
      }
    }
  }
  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  public setPlaylist(name: any) {
    this.loading = true;
    this.showStartingArtist = false;
    if (name === "current") {
      this.playlist = this.currentPlaylist;
      this.loading = false;
    } else if (name === "last.fm") {
      this.lastfmservice.getLovedTracks(this.username).subscribe(data => {
        this.playlist = this.playlistService.extractTracks(data.lovedtracks.track);
        this.loading = false;
      });
    } else if (name === "random") {
      this.playlist = this.playlistService.generateRandom();
      this.playlist.isContinues = true;
      this.playlist.type = name;
      this.loading = false;
    } else if (name === "radio") {
      this.playlist = this.generateRadio();
    } else if (name === "artist") {
      this.askForStartingArtist();
    } else if (name instanceof Playlist) {
      this.playlist = name;
      this.loading = false;
    } else {
      console.info("unknown playlist", name);
    }
  }
  public generateRadio(): any {
    this.lastfmservice.getTopArtists(this.username).subscribe(data => {
      data = data.topartists.artist;
      this.playlist = this.playlistService.extractArtists(data);
      this.playlist.isContinues = true;
      this.playlist.type = "radio";
      this.loading = false;
    });
  }
  public onChange() {
    const startArtist = this.core.getArtistByName(this.startingArtistName);
    const tmpPlaylist: Playlist = new Playlist();
    tmpPlaylist.name = `Artist radio for ${startArtist.name}`;
    tmpPlaylist.tracks = [this.playlistService.getRandomTrackFromList([startArtist])];

    this.showStartingArtist = false;
    this.playlist = tmpPlaylist;

    this.getNextSimilairArtist(startArtist, this.playlist);
  }
  public getNextSimilairArtist(artist: Artist, playlist: any): void {
    // get a similair artist from last.fm
    this.loading = true;
    this.lastfmservice.getSimilairArtists(artist).subscribe(data => {
      data = data.similarartists.artist;
      this.loading = false;
      const foundSimilair: Artist[] = [];
      data.forEach(lastfmartist => {
        const name = lastfmartist.name;
        const coreArtist = this.core.getArtistByName(name);
        if (coreArtist) {
          foundSimilair.push(coreArtist);
        }
      });
      // the next similair artist is ...
      if (foundSimilair.length > 0) {
        const nextTrack = this.playlistService.getNextTrackForPlaylist(foundSimilair, playlist);
        if (nextTrack && playlist.tracks.length < this.playlistService.numberOfTracksInAPlaylist) {
          playlist.tracks.push(nextTrack);
          this.getNextSimilairArtist(nextTrack.artist, playlist);
        }
      }
      // if no new similair artists are found this is the end of the line.
    });
  }
  private askForStartingArtist(): void {
    this.loading = false;
    this.playlist = null;
    this.showStartingArtist = true;
  }
}
