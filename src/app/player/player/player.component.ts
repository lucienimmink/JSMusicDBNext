declare const Windows: any;
declare const MediaMetadata: any;
declare const window: any;

import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import "album-art-component";
import { get } from "idb-keyval";
import { Subscription } from "rxjs";

import { Playlist } from "../../playlists/playlist";
import { ColorService } from "../../utils/color.service";
import { musicdbcore } from "./../../org/arielext/musicdb/core";
import Album from "./../../org/arielext/musicdb/models/Album";
import Track from "./../../org/arielext/musicdb/models/Track";
import { AnimationService } from "./../../utils/animation.service";
import { addCustomCss, getColorsFromRGBWithBGColor, getDominantColor, getDominantColorByURL, removeCustomCss } from "./../../utils/colorutil";
import { CoreService } from "./../../utils/core.service";
import { LastfmService } from "./../../utils/lastfm.service";
import { PathService } from "./../../utils/path.service";
import { PlayerService } from "./../player.service";
import { ConfigService } from "../../utils/config.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "mdb-player",
  templateUrl: "./player.component.html",
})
export class PlayerComponent implements OnDestroy {
  private static readonly SCROBBLETIME: number = 4 * 60 * 1000;
  public showPlayer = false;
  public usesDynamicAccentColor: boolean = this.booleanState("dynamic-accent-color");

  private subscription: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;
  private subscription6: Subscription;
  private subscription7: Subscription;
  private subscription8: Subscription;
  private playlist: Playlist;
  private trackIndex: any;
  private track: Track;
  private currentTrack: Track;
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
  private analyserID: number = -1;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private hearableBars: number;
  private canShowAnimation: boolean = false;
  private bgColor: string = '#fff';

  constructor(
    private pathService: PathService,
    private playerService: PlayerService,
    private router: Router,
    private lastFMService: LastfmService,
    private coreService: CoreService,
    private animationService: AnimationService,
    private colorService: ColorService,
    private configService: ConfigService
  ) {
    this.subscription = this.playerService.playlistAnnounced$.subscribe(playerData => {
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
    });
    this.subscription5 = this.playerService.hideVolumeWindowAnnounced$.subscribe(() => {
      this.showVolumeWindow = false;
    });
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
    this.subscription3 = this.playerService.volumeAnnounced.subscribe(volume => {
      this.volume = volume;
      this.mediaObject.volume = this.volume / 100;
    });
    this.subscription4 = pathService.pageAnnounced$.subscribe(page => {
      if (page.page === "Now playing") {
        this.showVolumeWindow = false;
        this.canShowAnimation = this.booleanState("visualisation-state")
        if (this.canShowAnimation) {
          this.analyserID = window.requestAnimationFrame(this.draw.bind(this))
        }
      } else {
        this.canShowAnimation = false
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
      this.systemMediaControls.playbackStatus = Windows.Media.MediaPlaybackStatus.closed;
    }
    if (navigator.userAgent.indexOf("Mobi") === -1) {
      // lets only handle these calculations on desktop grade devices.

      this.audioCtx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioCtx.createAnalyser();
      const source = this.audioCtx.createMediaElementSource(this.mediaObject);
      const sampleRate = this.audioCtx.sampleRate; // in hz
      this.analyser.fftSize = this.calculateFft ( sampleRate ) // this gives us 64 bars to play with
      this.hearableBars = this.getHearableBars(sampleRate, this.analyser.fftSize)
      source.connect(this.analyser);
      source.connect(this.audioCtx.destination);
      this.dataArray = new Uint8Array(this.hearableBars);
      this.analyser.getByteFrequencyData(this.dataArray);
    }
    this.subscription6 = this.colorService.color$.subscribe(rgba => {
      this.rgba = rgba;
    });
    this.subscription7 = this.colorService.blob$.subscribe(() => {
      const blob = new Blob([window.externalBlob], { type: "image/png" });
      // build a url from the blob
      const objectURL = URL.createObjectURL(blob);
      const image = new Image();
      image.src = objectURL;
      // now let's set that color!
      getDominantColor(
        image,
        rgba => {
          const colors = getColorsFromRGBWithBGColor(rgba, this.bgColor);
          this.colorService.setColor(colors.rgba);
          colors.rgba = colors.textLight;
          addCustomCss(colors);
        },
        true
      );
    });
    this.subscription8 = this.configService.mode$.subscribe(mode => {
      this.bgColor = (mode === 'light') ? "#fff" : '#000';
      if (this.usesDynamicAccentColor && this.rgba) {
        const colors = getColorsFromRGBWithBGColor(this.rgba, this.bgColor);
        colors.rgba = colors.textLight;
        addCustomCss(colors);
      }
    });
  }
  private draw() {
    setTimeout(() => {
      this.analyserID = window.requestAnimationFrame(this.draw.bind(this));
      if (!this.canShowAnimation) {
        window.cancelAnimationFrame(this.analyserID)
      }
    }, 1000 / 30);
    // re-get canvas
    const canvas = document.querySelector("canvas");
    const WIDTH = canvas.offsetWidth;
    const HEIGHT = canvas.offsetHeight;

    if (WIDTH && HEIGHT) {
      const ctx = canvas.getContext("2d");
      this.analyser.getByteFrequencyData(this.dataArray);
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      const color = this.rgba || {
        r: 0,
        g: 110,
        b: 205,
        a: 1,
      };
      const barWidth = Math.floor((WIDTH / this.hearableBars) * 1.1);
      let barHeight;
      let x = 0;
      const y = (HEIGHT / 150) * 1.17;

      for (let i = 0; i < this.hearableBars; i++) {
        barHeight = this.dataArray[i] * y;
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${this.dataArray[i] / 255})`;
        ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }
    }
  }
  private calculateFft (sampleRate): number {
    return Math.floor(sampleRate / 44100) * 128
  }
  private getHearableBars(sampleRate, fftSize): number {
    const halfFFT = fftSize / 2;
    switch (sampleRate) {
      case 48000:
        return halfFFT - 1
      case 88200:
        return halfFFT / 2
      case 96000:
        return (halfFFT / 2) - 2
      case 176400:
        return halfFFT / 4
      case 192000:
        return (halfFFT / 4) - 4
      case 352800:
        return halfFFT / 8
      case 384000:
        return (halfFFT / 8) - 8
      case 705600:
        return halfFFT / 16
      case 768000:
        return (halfFFT / 16) - 16
      default:
        return halfFFT;
    }
  }
  public setTrack(position: any) {
    this.track = this.playlist.tracks[this.trackIndex];
    if (!this.currentTrack || (this.track && this.currentTrack.id !== this.track.id) || this.forceRestart) {
      const dsm = localStorage.getItem("dsm");
      if (dsm) {
        this.url = dsm;
      }
      const jwt = localStorage.getItem("jwt");
      this.mediaObject.src = `${this.url}/listen?path=${encodeURIComponent(this.track.source.url)}&jwt=${jwt}`;
      this.currentTrack = this.track;
      this.hasScrobbledCurrentTrack = false;
      this.animationService.requestAnimation("enter", document.querySelector(".player h4"));
      this.animationService.requestAnimation("enter", document.querySelector(".player h5"));
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
  public readCurrentPlaylist() {
    get("current-playlist").then(c => {
      const current: any = c; // bah bah bah!
      if (current) {
        const core = this.coreService.getCore();
        const list: Track[] = [];
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
        this.playerService.doPlayPlaylist(playlist, current.current, false, current.isShuffled);
      }
    });
  }
  public ngOnDestroy() {
    this.subscription.unsubscribe(); // prevent memory leakage
    this.subscription2.unsubscribe(); // prevent memory leakage
    this.subscription3.unsubscribe(); // prevent memory leakage
    this.subscription4.unsubscribe();
    this.subscription5.unsubscribe();
    this.subscription6.unsubscribe();
    this.subscription7.unsubscribe();
    this.subscription8.unsubscribe();
    this.mediaObject.removeEventListener("ended");
    this.mediaObject.removeEventListener("timeupdate");
    this.mediaObject.removeEventListener("play");
    this.showVolumeWindow = false;
  }
  public navigateToArtist() {
    this.router.navigate(["/letter", this.track.album.artist.letter.escapedLetter, "artist", this.track.album.artist.sortName]);
  }
  public navigateToAlbum() {
    this.router.navigate([
      "/letter",
      this.track.album.artist.letter.escapedLetter,
      "artist",
      this.track.album.artist.sortName,
      "album",
      this.track.album.sortName,
    ]);
  }
  public navigateToNowPlaying() {
    // this.router.navigate(['NowPlaying']);
    this.router.navigate(["/now-playing"]);
  }
  public next() {
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
  public prev() {
    if (this.trackIndex > 0) {
      this.trackIndex--;
      this.playerService.prev();
    }
  }
  public togglePlayPause() {
    this.playerService.togglePlayPause();
  }

  public updateTime() {
    this.track.position = this.mediaObject.currentTime * 1000;
    if (!this.hasScrobbledCurrentTrack) {
      if (
        this.track.position >= PlayerComponent.SCROBBLETIME ||
        (this.track.position / this.track.duration >= 0.5 && performance.now() > PlayerComponent.SCROBBLETIME)
      ) {
        this.hasScrobbledCurrentTrack = true;
        try {
          this.lastFMService.scrobbleTrack(this.track).subscribe(() => {
            // console.info('track is scrobbled');
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
    localStorage.setItem("current-time", this.mediaObject.currentTime.toString());
  }

  public onplay() {
    try {
      this.lastFMService.announceNowPlaying(this.track).subscribe();
    } catch (e) {
      // console.error("caught error", e);
    }
    document.title = `${this.track.title} • ${this.track.trackArtist}`;
    if ("mediaSession" in navigator) {
      get(`art-${this.track.trackArtist}-${this.track.album.name}`).then(url => {
        if (url) {
          (navigator as any).mediaSession.metadata = new MediaMetadata({
            title: this.track.title,
            artist: this.track.trackArtist,
            album: this.track.album.name,
            artwork: [{ src: url, sizes: "500x500", type: "image/png" }],
          });
        }

        (navigator as any).mediaSession.setActionHandler("play", () => {
          this.togglePlayPause();
        });
        (navigator as any).mediaSession.setActionHandler("pause", () => {
          this.togglePlayPause();
        });
        (navigator as any).mediaSession.setActionHandler("previoustrack", () => {
          this.prev();
        });
        (navigator as any).mediaSession.setActionHandler("nexttrack", () => {
          this.next();
        });
      });
    }
    if (this.isHostedApp) {
      this.systemMediaControls.playbackStatus = Windows.Media.MediaPlaybackStatus.playing;
      this.displayUpdater.type = Windows.Media.MediaPlaybackType.music;
      get(`art-${this.track.trackArtist}-${this.track.album.name}`).then(url => {
        // update system transport
        try {
          if (this.displayUpdater !== undefined) {
            this.displayUpdater.musicProperties.albumArtist = this.track.trackArtist;
            this.displayUpdater.musicProperties.artist = this.track.trackArtist;
            this.displayUpdater.musicProperties.albumTitle = this.track.album.name;
            this.displayUpdater.musicProperties.title = this.track.title;
            if (url) {
              // tslint:disable-next-line:max-line-length
              this.displayUpdater.thumbnail = Windows.Storage.Streams.RandomAccessStreamReference.createFromUri(new Windows.Foundation.Uri(url));
            }
            this.displayUpdater.update();
          }
        } catch (e) {
          console.error("error occurred", e);
        }
        // update live tile
        this.updateWinTile(url);
      });
    }
    document.querySelector("mdb-player").dispatchEvent(new CustomEvent("external.mdbplaying", { detail: this.track }));
    if (this.audioCtx) {
      this.audioCtx.resume();
    }
    this.usesDynamicAccentColor = this.booleanState("dynamic-accent-color");
    if (this.usesDynamicAccentColor && this.rgba) {
      const colors = getColorsFromRGBWithBGColor(this.rgba, this.bgColor);
      colors.rgba = colors.textLight;
      addCustomCss(colors);
    }
  }

  public onstop() {
    document.querySelector("mdb-player").dispatchEvent(new Event("external.mdbstopped"));
    document.title = `JSMusicDB Next`;
    if (this.isHostedApp) {
      this.systemMediaControls.playbackStatus = Windows.Media.MediaPlaybackStatus.stopped;
    }
    if (this.audioCtx) {
      this.audioCtx.suspend();
    }
    removeCustomCss();
  }
  public onpause() {
    document.querySelector("mdb-player").dispatchEvent(new CustomEvent("external.mdbpaused", { detail: this.track }));
    document.title = `JSMusicDB Next`;
    if (this.isHostedApp) {
      this.systemMediaControls.playbackStatus = Windows.Media.MediaPlaybackStatus.paused;
    }
    if (this.audioCtx) {
      this.audioCtx.suspend();
    }
    removeCustomCss();
  }
  public onChangeArt(evt) {
    if (this.usesDynamicAccentColor) {
      const { art } = evt.detail;
      getDominantColorByURL(
        art,
        rgba => {
          const colors = getColorsFromRGBWithBGColor(rgba, this.bgColor);
          this.colorService.setColor(colors.rgba);
          colors.rgba = colors.textLight;
          addCustomCss(colors);
        },
        false
      );
    } else {
      this.colorService.setColor({
        r: 0,
        g: 110,
        b: 205,
        a: 1,
      });
      removeCustomCss();
    }
  }
  public toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    this.playerService.shufflePlaylist(this.isShuffled);
  }
  public toggleLoved() {
    this.track.isLoved = !this.track.isLoved;
    this.lastFMService.toggleLoved(this.track).subscribe();
  }
  public toggleVolumeWindow(e: Event) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
    this.showVolumeWindow = !this.showVolumeWindow;
  }
  public onprogress() {
    const buffered = this.mediaObject.buffered;
    if (buffered.length !== 0) {
      this.track.buffered.start = buffered.start(buffered.length !== 0 ? buffered.length - 1 : 0) * 1000;
      this.track.buffered.end = buffered.end(buffered.length !== 0 ? buffered.length - 1 : 0) * 1000;
    }
  }
  public setVolume() {
    this.mediaObject.volume = this.volume / 100;
    this.playerService.setVolume(this.volume); // update the shared volume property
  }
  public jump(e: any): void {
    const clientX = e.clientX || e.changedTouches[0].clientX;
    const left = clientX;
    const perc = left / document.querySelector(".player").clientWidth;
    const pos = (this.track.duration / 1000) * perc;
    this.playerService.setPosition(pos);
  }

  private booleanState(key: string): boolean {
    const raw = localStorage.getItem(key);
    if (raw && raw === "true") {
      return true;
    }
    return false;
  }
  private updateWinTile(url: {}) {
    const Notifications = Windows.UI.Notifications;
    Notifications.TileUpdateManager.createTileUpdaterForApplication("App").clear();
    // tslint:disable-next-line:max-line-length
    const tileXml = Notifications.TileUpdateManager.getTemplateContent(Notifications.TileTemplateType.tileSquare150x150PeekImageAndText02);
    let textNode = tileXml.getElementsByTagName("text")[0];
    textNode.innerText = this.track.title;
    textNode = tileXml.getElementsByTagName("text")[1];
    textNode.innerText = this.track.trackArtist;
    if (url) {
      const imageNode = tileXml.getElementsByTagName("image")[0];
      imageNode.attributes[1].value = url;
    }
    const currentTime = new Date();
    const expiryTime = new Date(currentTime.getTime() + Number(this.track.duration));
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
    Notifications.TileUpdateManager.createTileUpdaterForApplication("App").update(tileNotification);
  }

  private getTileContent(url: {}, tiletype: string): any {
    const Notifications = Windows.UI.Notifications;
    const tileXml = Notifications.TileUpdateManager.getTemplateContent(Notifications.TileTemplateType[tiletype]);
    try {
      const textNode = tileXml.getElementsByTagName("text")[0];
      textNode.innerText = this.track.title;
    } catch (e) {
      console.error(e);
    }
    try {
      const textNode = tileXml.getElementsByTagName("text")[1];
      textNode.innerText = this.track.trackArtist;
    } catch (e) {
      console.error(e);
    }
    if (url) {
      const imageNode = tileXml.getElementsByTagName("image")[0];
      imageNode.attributes[1].value = url;
    }
    return tileXml;
  }
}

