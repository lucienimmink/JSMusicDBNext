import { Injectable } from "@angular/core";
import { del, set } from "idb-keyval";
import { Subject, Subscription } from "rxjs";

import { musicdbcore } from "./../org/arielext/musicdb/core";
import Album from "./../org/arielext/musicdb/models/Album";
import Track from "./../org/arielext/musicdb/models/Track";
import { Playlist } from "../playlists/playlist";
import { PlaylistService } from "../playlists/playlist.service";
import { CoreService } from "./../utils/core.service";
import { LastfmService } from "./../utils/lastfm.service";

@Injectable()
export class PlayerService {
  public playlistSource = new Subject<any>();
  public volumeSource = new Subject<any>();
  public hideVolumeWindowAsSource = new Subject<any>();
  public playlistAnnounced$ = this.playlistSource.asObservable();
  public volumeAnnounced = this.volumeSource.asObservable();
  public hideVolumeWindowAnnounced$ = this.hideVolumeWindowAsSource.asObservable();
  private currentPlaylist: any;
  private currentTrack: Track;

  private isPlaying = false;
  private isPaused = false;
  private isShuffled = false;
  private forceRestart = false;

  private volume = 100;

  private position: number;

  private lastfmUserName: string = localStorage.getItem("lastfm-username"); // should be subscriber?

  private subscription: Subscription;

  constructor(private lastFMService: LastfmService, private coreService: CoreService, private playlistService: PlaylistService) {
    this.subscription = this.playlistService.playlistAnnounced$.subscribe(nextPlaylist => {
      // a new radio playlist has been generated; let's play
      this.doPlayPlaylist(nextPlaylist, 0, true, this.isShuffled);
    });
  }

  public setPosition(position: number) {
    this.position = position;
    this.announce();
    this.position = null;
  }

  public doPlayAlbum(album: Album, startIndex: number, forceRestart: boolean = false, isShuffled: boolean = false) {
    if (this.currentTrack) {
      this.currentTrack.isPaused = false;
      this.currentTrack.isPlaying = false;
    }
    this.setPlaylist(album, startIndex, forceRestart, isShuffled, "album");
    this.announce();
  }
  public doPlayPlaylist(playlist: Playlist, startIndex: number, forceRestart: boolean = false, isShuffled: boolean = false) {
    if (this.currentTrack) {
      this.currentTrack.isPaused = false;
      this.currentTrack.isPlaying = false;
    }
    this.setPlaylist(playlist, startIndex, forceRestart, isShuffled, "playlist");
    this.announce();
  }

  public doPlayTrack(track: Track) {
    if (this.currentTrack) {
      this.currentTrack.isPaused = false;
      this.currentTrack.isPlaying = false;
    }
    const playlist = new Playlist();
    playlist.isOwn = true;
    playlist.name = track.title;
    playlist.tracks.push(track);
    this.currentPlaylist = {
      playlist,
      startIndex: 0,
      isPlaying: (this.isPlaying = true),
      isPaused: (this.isPaused = false),
      isShuffled: false,
      forceRestart: (this.forceRestart = true),
      isContinues: false
    };
    this.announce();
  }

  public nextPlaylist(type: string): void {
    if (this.booleanState("continues-play")) {
      if (type === "random") {
        const nextPlaylist = this.playlistService.generateRandom();
        this.doPlayPlaylist(nextPlaylist, 0, true, this.isShuffled);
      } else {
        this.playlistService.generateRadio(); // async
      }
    } else {
      this.stop();
    }
  }

  public nextAlbum(album: Album): void {
    if (this.booleanState("continues-play")) {
      const nextAlbum = this.coreService.getCore().getNextAlbum(album);
      if (nextAlbum) {
        this.doPlayAlbum(nextAlbum, 0, true, this.isShuffled);
      } else {
        console.warn("no new album found, stopping playback");
        this.stop();
      }
    } else {
      this.stop();
    }
  }
  public playlistToString(): string {
    const list: string[] = [];
    this.currentPlaylist.playlist.tracks.forEach((track: Track) => {
      if (track) {
        list.push(track.id);
      }
    });
    return JSON.stringify({
      ids: list,
      isShuffled: this.isShuffled,
      isContinues: this.currentPlaylist.isContinues,
      current: this.currentPlaylist.startIndex,
      type: this.currentPlaylist.type
    });
  }
  public playlistSync(): any {
    const list: string[] = [];
    this.currentPlaylist.playlist.tracks.forEach((track: Track) => {
      if (track) {
        list.push(track.id);
      }
    });
    return {
      ids: list,
      isShuffled: this.isShuffled,
      isContinues: this.currentPlaylist.isContinues,
      current: this.currentPlaylist.startIndex,
      type: this.currentPlaylist.type
    };
  }
  public getCurrentPlaylist() {
    return this.currentPlaylist;
  }
  public shufflePlaylist(shuffled: boolean) {
    this.isShuffled = shuffled;
    this.currentPlaylist.playlist.tracks.sort(this.sortPlaylist);
    if (shuffled) {
      this.currentPlaylist.playlist.tracks = this.shuffle(this.currentPlaylist.playlist.tracks);
    }
    this.currentPlaylist.startIndex = this.currentPlaylist.playlist.tracks.indexOf(this.currentTrack);
    this.currentPlaylist.forceRestart = false;
    this.announce();
  }
  public sortPlaylist(a: Track, b: Track) {
    if (a.disc < b.disc) {
      return -1;
    } else if (a.disc > b.disc) {
      return 1;
    } else {
      if (a.number < b.number) {
        return -1;
      } else if (a.number > b.number) {
        return 1;
      }
      return 0;
    }
  }
  public shuffle(list: Track[]): Track[] {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = list[i];
      list[i] = list[j];
      list[j] = temp;
    }
    return list;
  }
  public next() {
    if (this.currentTrack) {
      this.currentTrack.isPaused = false;
      this.currentTrack.isPlaying = false;
    }
    if (this.currentPlaylist) {
      this.currentPlaylist.startIndex++;
      this.currentPlaylist.forceRestart = false;
      this.announce();
    }
  }
  public prev() {
    if (this.currentTrack) {
      this.currentTrack.isPaused = false;
      this.currentTrack.isPlaying = false;
    }
    if (this.currentPlaylist) {
      this.currentPlaylist.startIndex--;
      if (this.currentPlaylist.startIndex <= 0) {
        this.currentPlaylist.startIndex = 0;
      }
      this.currentPlaylist.forceRestart = false;
      this.announce();
    }
  }
  public pause() {
    if (this.currentPlaylist) {
      this.isPlaying = false;
      this.isPaused = true;
      this.currentPlaylist.forceRestart = false;
      this.announce();
    }
  }
  public resume() {
    if (this.currentPlaylist) {
      this.isPlaying = true;
      this.isPaused = false;
      this.currentPlaylist.forceRestart = false;
      this.announce();
    }
  }
  public stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentPlaylist = null;
    del("current-playlist");
    localStorage.removeItem("current-time");
    this.playlistSource.next(this.currentPlaylist);
  }
  public togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }
  public announce() {
    if (this.currentPlaylist) {
      this.currentTrack = this.currentPlaylist.playlist.tracks[this.currentPlaylist.startIndex];
      if (this.lastfmUserName) {
        this.lastFMService.getTrackInfo(this.currentTrack, this.lastfmUserName).subscribe(status => {
          if (this.currentTrack && status.track) {
            this.currentTrack.isLoved = status.track.userloved === "1";
          }
        });
      }
      if (this.currentTrack) {
        this.currentTrack.isPaused = this.isPaused;
        this.currentTrack.isPlaying = this.isPlaying;

        this.currentPlaylist.isPlaying = this.isPlaying;
        this.currentPlaylist.isPaused = this.isPaused;

        this.currentPlaylist.isShuffled = this.isShuffled;

        this.currentPlaylist.position = this.position;

        set("current-playlist", this.playlistSync());
        this.playlistSource.next(this.currentPlaylist);
      }
    }
  }
  public getVolume(): number {
    return this.volume;
  }
  public setVolume(volume: number): void {
    this.volume = volume;
    this.volumeSource.next(this.volume);
  }
  public hideVolumeControl(): void {
    this.hideVolumeWindowAsSource.next(true);
  }

  private booleanState(key: string): boolean {
    const raw = localStorage.getItem(key);
    if (raw && raw === "true") {
      return true;
    }
    return false;
  }

  private setPlaylist(playlist: any, startIndex: number = 0, forceRestart: boolean = true, isShuffled: boolean = false, type: string = "album"): void {
    this.currentPlaylist = {
      playlist,
      startIndex,
      isPlaying: (this.isPlaying = true),
      isPaused: (this.isPaused = false),
      isShuffled: (this.isShuffled = isShuffled),
      forceRestart: (this.forceRestart = forceRestart),
      isContinues: playlist.isContinues || type === "album",
      type: playlist.type
    };
  }
}
