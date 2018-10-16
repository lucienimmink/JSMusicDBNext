declare const Windows: any;
declare const MediaMetadata: any;

import { Component, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { get } from "idb-keyval";

import { PlayerService } from "./../player.service";
import { AlbumArtComponent } from "./../../utils/album-art/album-art.component";
import Album from "./../../org/arielext/musicdb/models/Album";
import Track from "./../../org/arielext/musicdb/models/Track";
import { LastfmService } from "./../../utils/lastfm.service";
import { CoreService } from "./../../utils/core.service";
import { musicdbcore } from "./../../org/arielext/musicdb/core";
import { AnimationService } from "./../../utils/animation.service";
import { PathService } from "./../../utils/path.service";
import { AlbumArtService } from "./../../utils/album-art.service";
import {
  removeCustomCss,
  addCustomCssBasedOnRGBA
} from "./../../utils/colorutil";
import { ColorService } from "../../utils/color.service";
import { Playlist } from "./../../playlist/playlist";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "mdb-player",
  templateUrl: "./player.component.html",
  providers: [AlbumArtService]
})
export class PlayerComponent implements OnDestroy {
  private subscription: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;
  private subscription6: Subscription;
  private playlist: Playlist;
  private trackIndex: any;
  private track: Track;
  private currentTrack: Track;
  public showPlayer = false;
  private isPlaying = false;
  private isPaused = false;
  private mediaObject: any;
  private hasScrobbledCurrentTrack = false;
  private url: string;
  private core: musicdbcore;
  private isCurrentPlaylistLoaded = false;
  private isShuffled = false;
  private forceRestart = false;
  private showVolumeWindow = false;
  private volume = 100;
  // onetime check to see if we have a hosted web app
  private isHostedApp: boolean = typeof Windows !== "undefined";
  private systemMediaControls: any;
  private displayUpdater: any;
  private audioCtx: AudioContext;
  private rgba: any;
  public usesDynamicAccentColor: boolean = this.booleanState(
    "dynamic-accent-color"
  );

  @ViewChild(AlbumArtComponent) albumart: AlbumArtComponent;

  constructor(
    private pathService: PathService,
    private playerService: PlayerService,
    private router: Router,
    private lastFMService: LastfmService,
    private coreService: CoreService,
    private animationService: AnimationService,
    private albumartService: AlbumArtService,
    private colorService: ColorService
  ) {
    this.subscription = this.playerService.playlistAnnounced$.subscribe(
      playerData => {
        if (playerData) {
          this.playlist = playerData.playlist;
          this.trackIndex = playerData.startIndex;
          this.isPaused = playerData.isPaused;
          this.isPlaying = playerData.isPlaying;
          this.isShuffled = playerData.isShuffled;
          this.forceRestart = playerData.forceRestart;
          this.showPlayer = this.isPaused || this.isPlaying;
          this.setTrack(playerData.position);
        } else {
          this.isPlaying = false;
          this.showPlayer = false;
          this.mediaObject.pause();
        }
      }
    );
    this.subscription5 = this.playerService.hideVolumeWindowAnnounced$.subscribe(
      () => {
        this.showVolumeWindow = false;
      }
    );
    this.mediaObject = document.querySelector("audio");
    this.mediaObject.crossOrigin = "anonymous";
    this.mediaObject.canPlayType("audio/flac");
    this.mediaObject.addEventListener("ended", () => {
      this.next();
    });
    this.mediaObject.addEventListener("timeupdate", () => {
      this.updateTime();
    });
    this.mediaObject.addEventListener("play", () => {
      this.onplay();
    });
    this.mediaObject.addEventListener("progress", () => {
      this.onprogress();
    });
    this.mediaObject.addEventListener("pause", () => {
      this.onpause();
    });
    this.mediaObject.addEventListener("ended", () => {
      this.onstop();
    });
    const dsm = localStorage.getItem("dsm");
    if (dsm) {
      this.url = dsm;
    }
    this.core = this.coreService.getCore();
    this.subscription2 = this.core.coreParsed$.subscribe(data => {
      const state = localStorage.getItem("save-playlist-state");
      if (state && state === "true") {
        // read the current playlist on startup
        this.readCurrentPlaylist();
      }
    });
    this.subscription3 = this.playerService.volumeAnnounced.subscribe(
      volume => {
        this.volume = volume;
        this.mediaObject.volume = this.volume / 100;
      }
    );
    this.subscription4 = pathService.pageAnnounced$.subscribe(page => {
      if (page.page === "Now playing") {
        this.showVolumeWindow = false;
      }
    });
    if (this.isHostedApp) {
      this.systemMediaControls = Windows.Media.SystemMediaTransportControls.getForCurrentView();
      this.displayUpdater = this.systemMediaControls.displayUpdater;
      this.systemMediaControls.isEnabled = true;
      this.systemMediaControls.isPlayEnabled = true;
      this.systemMediaControls.isPauseEnabled = true;
      this.systemMediaControls.isStopEnabled = true;
      this.systemMediaControls.isNextEnabled = true;
      this.systemMediaControls.isPreviousEnabled = true;
      this.systemMediaControls.addEventListener(
        "buttonpressed",
        (e: Event) => {
          const mediaButton = Windows.Media.SystemMediaTransportControlsButton;
          switch ((e as any).button) {
            case mediaButton.play:
              this.mediaObject.play();
              break;
            case mediaButton.pause:
              this.mediaObject.pause();
              break;
            case mediaButton.stop:
              this.playerService.stop();
              break;
            case mediaButton.next:
              this.next();
              break;
            case mediaButton.previous:
              this.prev();
              break;
            default:
              console.warn("key not mapped in application", (e as any).button);
          }
        },
        false
      );
      this.systemMediaControls.playbackStatus =
        Windows.Media.MediaPlaybackStatus.closed;
    }
    if (navigator.userAgent.indexOf("Mobi") === -1) {
      // lets only handle these calculations on desktop grade devices.
      const canvas = document.querySelector("canvas");
      let WIDTH = canvas.offsetWidth;
      let HEIGHT = canvas.offsetHeight;
      // set canvas defaults

      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      const ctx = canvas.getContext("2d");

      this.audioCtx = new ((window as any).AudioContext ||
        (window as any).webkitAudioContext)();
      const javascriptNode = this.audioCtx.createScriptProcessor(
        1024 * 2,
        1,
        1
      );
      javascriptNode.connect(this.audioCtx.destination);
      const analyser = this.audioCtx.createAnalyser();
      const source = this.audioCtx.createMediaElementSource(this.mediaObject);

      analyser.fftSize = 128;
      const bufferLength = analyser.frequencyBinCount;
      source.connect(analyser);
      analyser.connect(javascriptNode);

      source.connect(this.audioCtx.destination);
      javascriptNode.onaudioprocess = () => {
        // tslint:disable-next-line:no-shadowed-variable
        const canvas = document.querySelector("canvas");
        const color = this.rgba || {
          r: 0,
          g: 110,
          b: 205,
          a: 1
        };
        WIDTH = canvas.offsetWidth;
        HEIGHT = canvas.offsetHeight;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        // tslint:disable-next-line:no-shadowed-variable
        const ctx = canvas.getContext("2d");
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        const barWidth = Math.floor((WIDTH / bufferLength) * 1.1);
        let barHeight;
        let x = 0;
        const y = (HEIGHT / 150) * 1.17;
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] * y;
          // ctx.fillStyle = `rgb(0,${Math.floor((barHeight * 0.47) / y)}, ${Math.floor((barHeight * 0.84) / y)})`
          // rgba(0, 120, 215, 1);
          ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${dataArray[
            i
          ] / 255})`;
          ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
          x += barWidth + 1;
        }
      };
    }
    this.subscription6 = this.colorService.color$.subscribe(rgba => {
      this.rgba = rgba;
    });
  }

  private booleanState(key: string): boolean {
    const raw = localStorage.getItem(key);
    if (raw && raw === "true") {
      return true;
    }
    return false;
  }

  setTrack(position: any) {
    setTimeout(() => {
      if (this.albumart) {
        this.albumart.ngOnInit();
      }
    });
    this.track = this.playlist.tracks[this.trackIndex];
    if (
      !this.currentTrack ||
      (this.track && this.currentTrack.id !== this.track.id) ||
      this.forceRestart
    ) {
      const dsm = localStorage.getItem("dsm");
      if (dsm) {
        this.url = dsm;
      }
      const jwt = localStorage.getItem("jwt");
      this.mediaObject.src = `${this.url}/listen?path=${encodeURIComponent(
        this.track.source.url
      )}&jwt=${jwt}`;
      this.currentTrack = this.track;
      this.hasScrobbledCurrentTrack = false;
      this.animationService.requestAnimation(
        "enter",
        document.querySelector(".player h4")
      );
      this.animationService.requestAnimation(
        "enter",
        document.querySelector(".player h5")
      );
    }
    if (this.isPlaying) {
      this.mediaObject.play();
    } else {
      this.mediaObject.pause();
    }
    if (this.isCurrentPlaylistLoaded) {
      this.mediaObject.currentTime = localStorage.getItem("current-time") || 0;
      this.isCurrentPlaylistLoaded = false; // ignore for all next tracks
    }
    if (position) {
      this.mediaObject.currentTime = position;
    }
  }
  readCurrentPlaylist() {
    get("current-playlist").then(c => {
      const current: any = c; // bah bah bah!
      if (current) {
        const core = this.coreService.getCore();
        const list: Array<Track> = [];
        current.ids.forEach(id => {
          const track = core.tracks[id];
          list.push(track);
        });
        const playlist = new Playlist();
        playlist.tracks = list;
        playlist.name = "Current Playlist";
        playlist.isContinues = current.isContinues || false;
        playlist.type = current.type;

        this.isShuffled = current.isShuffled;
        this.isCurrentPlaylistLoaded = true;
        this.playerService.doPlayPlaylist(
          playlist,
          current.current,
          false,
          current.isShuffled
        );
      }
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe(); // prevent memory leakage
    this.subscription2.unsubscribe(); // prevent memory leakage
    this.subscription3.unsubscribe(); // prevent memory leakage
    this.subscription4.unsubscribe();
    this.subscription5.unsubscribe();
    this.subscription6.unsubscribe();
    this.mediaObject.removeEventListener("ended");
    this.mediaObject.removeEventListener("timeupdate");
    this.mediaObject.removeEventListener("play");
    this.showVolumeWindow = false;
  }
  navigateToArtist() {
    this.router.navigate([
      "/letter",
      this.track.album.artist.letter.escapedLetter,
      "artist",
      this.track.album.artist.sortName
    ]);
  }
  navigateToAlbum() {
    this.router.navigate([
      "/letter",
      this.track.album.artist.letter.escapedLetter,
      "artist",
      this.track.album.artist.sortName,
      "album",
      this.track.album.sortName
    ]);
  }
  navigateToNowPlaying() {
    // this.router.navigate(['NowPlaying']);
    this.router.navigate(["/now-playing"]);
  }
  next() {
    if (this.trackIndex < this.playlist.tracks.length - 1) {
      this.trackIndex++;
      this.playerService.next();
    } else {
      if (this.playlist.isContinues) {
        // generate a new playlist and start playing that one
        this.trackIndex = 0;
        if (this.playlist.type === "random" || this.playlist.type === "radio") {
          this.playerService.nextPlaylist(this.playlist.type);
        } else {
          this.playerService.nextAlbum(this.track.album);
        }
      } else {
        this.playerService.stop();
      }
    }
  }
  prev() {
    if (this.trackIndex > 0) {
      this.trackIndex--;
      this.playerService.prev();
    }
  }
  togglePlayPause() {
    this.playerService.togglePlayPause();
  }

  updateTime() {
    this.track.position = this.mediaObject.currentTime * 1000;
    if (!this.hasScrobbledCurrentTrack) {
      // TODO: this must be settings; add offline/manual scrobbling
      if (
        this.track.position >= 4 * 60 * 1000 ||
        this.track.position / this.track.duration >= 0.5
      ) {
        this.hasScrobbledCurrentTrack = true;
        try {
          this.lastFMService.scrobbleTrack(this.track).subscribe(() => {
            // console.log('track is scrobbled');
          });
        } catch (e) {}
      }
    }
    localStorage.setItem(
      "current-time",
      this.mediaObject.currentTime.toString()
    );
  }

  onplay() {
    this.lastFMService
      .announceNowPlaying(this.track)
      .subscribe(data => {}, error => {}, () => {});
    document.title = `${this.track.title} by ${this.track.trackArtist}`;
    if ("mediaSession" in navigator) {
      get(`art-${this.track.trackArtist}-${this.track.album.name}`).then(
        url => {
          (navigator as any).mediaSession.metadata = new MediaMetadata({
            title: this.track.title,
            artist: this.track.trackArtist,
            album: this.track.album.name,
            artwork: [{ src: url, sizes: "500x500", type: "image/png" }]
          });

          (navigator as any).mediaSession.setActionHandler("play", () => {
            this.togglePlayPause();
          });
          (navigator as any).mediaSession.setActionHandler("pause", () => {
            this.togglePlayPause();
          });
          (navigator as any).mediaSession.setActionHandler(
            "previoustrack",
            () => {
              this.prev();
            }
          );
          (navigator as any).mediaSession.setActionHandler("nexttrack", () => {
            this.next();
          });
        }
      );
    }
    if (this.isHostedApp) {
      this.systemMediaControls.playbackStatus =
        Windows.Media.MediaPlaybackStatus.playing;
      this.displayUpdater.type = Windows.Media.MediaPlaybackType.music;
      get(`art-${this.track.trackArtist}-${this.track.album.name}`).then(
        url => {
          // update system transport
          try {
            if (this.displayUpdater !== undefined) {
              this.displayUpdater.musicProperties.albumArtist = this.track.trackArtist;
              this.displayUpdater.musicProperties.artist = this.track.trackArtist;
              this.displayUpdater.musicProperties.albumTitle = this.track.album.name;
              this.displayUpdater.musicProperties.title = this.track.title;
              if (url) {
                // tslint:disable-next-line:max-line-length
                this.displayUpdater.thumbnail = Windows.Storage.Streams.RandomAccessStreamReference.createFromUri(
                  new Windows.Foundation.Uri(url)
                );
              }
              this.displayUpdater.update();
            }
          } catch (e) {
            console.error("error occurred", e);
          }
          // update live tile
          this.updateWinTile(url);
        }
      );
    }
    document
      .querySelector("mdb-player")
      .dispatchEvent(
        new CustomEvent("external.mdbplaying", { detail: this.track })
      );
    if (this.audioCtx) {
      this.audioCtx.resume();
    }
    addCustomCssBasedOnRGBA(this.rgba);
  }
  private updateWinTile(url: {}) {
    const Notifications = Windows.UI.Notifications;
    Notifications.TileUpdateManager.createTileUpdaterForApplication(
      "App"
    ).clear();
    // tslint:disable-next-line:max-line-length
    const tileXml = Notifications.TileUpdateManager.getTemplateContent(
      Notifications.TileTemplateType.tileSquare150x150PeekImageAndText02
    );
    let textNode = tileXml.getElementsByTagName("text")[0];
    textNode.innerText = this.track.title;
    textNode = tileXml.getElementsByTagName("text")[1];
    textNode.innerText = this.track.trackArtist;
    if (url) {
      const imageNode = tileXml.getElementsByTagName("image")[0];
      imageNode.attributes[1].value = url;
    }
    const currentTime = new Date();
    const expiryTime = new Date(
      currentTime.getTime() + Number(this.track.duration)
    );
    let node = tileXml.importNode(
      this.getTileContent(url, "tileSquare310x310ImageAndText02")
        .getElementsByTagName("binding")
        .item(0),
      true
    );
    tileXml
      .getElementsByTagName("visual")
      .item(0)
      .appendChild(node);
    node = tileXml.importNode(
      this.getTileContent(url, "tileWide310x150PeekImage02")
        .getElementsByTagName("binding")
        .item(0),
      true
    );
    tileXml
      .getElementsByTagName("visual")
      .item(0)
      .appendChild(node);
    node = tileXml.importNode(
      this.getTileContent(url, "tileSquare71x71Image")
        .getElementsByTagName("binding")
        .item(0),
      true
    );
    tileXml
      .getElementsByTagName("visual")
      .item(0)
      .appendChild(node);
    const tileNotification = new Notifications.TileNotification(tileXml);
    tileNotification.expirationTime = expiryTime;
    Notifications.TileUpdateManager.createTileUpdaterForApplication(
      "App"
    ).update(tileNotification);
  }

  private getTileContent(url: {}, tiletype: string): any {
    const Notifications = Windows.UI.Notifications;
    const tileXml = Notifications.TileUpdateManager.getTemplateContent(
      Notifications.TileTemplateType[tiletype]
    );
    try {
      let textNode = tileXml.getElementsByTagName("text")[0];
      textNode.innerText = this.track.title;
    } catch (e) {}
    try {
      let textNode = tileXml.getElementsByTagName("text")[1];
      textNode.innerText = this.track.trackArtist;
    } catch (e) {}
    if (url) {
      const imageNode = tileXml.getElementsByTagName("image")[0];
      imageNode.attributes[1].value = url;
    }
    return tileXml;
  }

  onstop() {
    document
      .querySelector("mdb-player")
      .dispatchEvent(new Event("external.mdbstopped"));
    document.title = `JSMusicDB Next`;
    if (this.isHostedApp) {
      this.systemMediaControls.playbackStatus =
        Windows.Media.MediaPlaybackStatus.stopped;
    }
    if (this.audioCtx) {
      this.audioCtx.suspend();
    }
    removeCustomCss();
  }
  onpause() {
    document
      .querySelector("mdb-player")
      .dispatchEvent(
        new CustomEvent("external.mdbpaused", { detail: this.track })
      );
    document.title = `JSMusicDB Next`;
    if (this.isHostedApp) {
      this.systemMediaControls.playbackStatus =
        Windows.Media.MediaPlaybackStatus.paused;
    }
    if (this.audioCtx) {
      this.audioCtx.suspend();
    }
    removeCustomCss();
  }

  toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    this.playerService.shufflePlaylist(this.isShuffled);
  }
  toggleLoved() {
    this.track.isLoved = !this.track.isLoved;
    this.lastFMService.toggleLoved(this.track).subscribe(data => {});
  }
  toggleVolumeWindow(e: Event) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
    this.showVolumeWindow = !this.showVolumeWindow;
  }
  onprogress() {
    const buffered = this.mediaObject.buffered;
    if (buffered.length !== 0) {
      this.track.buffered.start =
        buffered.start(buffered.length !== 0 ? buffered.length - 1 : 0) * 1000;
      this.track.buffered.end =
        buffered.end(buffered.length !== 0 ? buffered.length - 1 : 0) * 1000;
    }
  }
  setVolume() {
    this.mediaObject.volume = this.volume / 100;
    this.playerService.setVolume(this.volume); // update the shared volume property
  }
  jump(e: any): void {
    const clientX = e.clientX || e.changedTouches[0].clientX;
    const left = clientX,
      perc = left / document.querySelector(".player").clientWidth;
    const pos = (this.track.duration / 1000) * perc;
    this.playerService.setPosition(pos);
  }
}
