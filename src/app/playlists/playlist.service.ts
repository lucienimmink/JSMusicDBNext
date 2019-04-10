import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { musicdbcore } from "../org/arielext/musicdb/core";
import Album from "../org/arielext/musicdb/models/Album";
import Artist from "../org/arielext/musicdb/models/Artist";
import Track from "../org/arielext/musicdb/models/Track";
import { CoreService } from "../utils/core.service";
import { LastfmService } from "../utils/lastfm.service";
import { Playlist } from "./playlist";

@Injectable()
export class PlaylistService {
  public playlistSubject: Subject<any> = new Subject<any>();
  public playlistAnnounced$ = this.playlistSubject.asObservable();
  public numberOfTracksInAPlaylist = 100;

  private core: musicdbcore;
  private username: string = localStorage.getItem("lastfm-username");
  private playlist: Playlist;

  constructor(private coreService: CoreService, private lastfmservice: LastfmService) {
    this.core = this.coreService.getCore();
  }

  public generateRandom(): any {
    const coretracknames = Object.keys(this.core.tracks);
    const randomTracks: string[] = this.shuffle(coretracknames).splice(0, this.numberOfTracksInAPlaylist);
    const tmpPlaylist: Playlist = new Playlist();
    tmpPlaylist.name = `${this.numberOfTracksInAPlaylist} random tracks`;
    randomTracks.map(id => {
      tmpPlaylist.tracks.push(this.core.tracks[id]);
    });
    return tmpPlaylist;
  }

  public generateRadio(): any {
    this.lastfmservice.getTopArtists(this.username).subscribe(data => {
      this.playlistSubject.next(this.extractArtists(data));
    });
  }

  public extractTracks(data: any[]): any {
    const tmpPlaylist: Playlist = new Playlist();
    tmpPlaylist.name = "Loved tracks on Last.FM";
    data.map(line => {
      const artistName: string = line.artist.name;
      const trackName: string = line.name;
      const track: any = this.core.getTrackByArtistAndName(artistName, trackName);
      if (track) {
        tmpPlaylist.tracks.push(track);
      }
    });
    return tmpPlaylist;
  }
  public extractArtists(data: any[]): any {
    const highRotation: Artist[] = [];
    const mediumRotation: Artist[] = [];
    data.forEach((line, index) => {
      const artistName: string = line.name;
      line.dummy = true; // use dummy artist for lookup;
      const artist: Artist = new Artist(line);
      const foundArtist: Artist = this.core.artists[artist.sortName];
      if (foundArtist && index < 10) {
        highRotation.push(foundArtist);
      } else {
        mediumRotation.push(foundArtist);
      }
    });
    return this.generateRadioList(highRotation, mediumRotation);
  }

  public generateRadioList(highRotation: Artist[], mediumRotation: Artist[]): Playlist {
    const tmpPlaylist: Playlist = new Playlist();
    tmpPlaylist.name = `${this.numberOfTracksInAPlaylist} random tracks based on your recently listened tracks`;

    for (let i = 0; i < this.numberOfTracksInAPlaylist; i++) {
      if (i % 3 === 0 || i % 5 === 0) {
        tmpPlaylist.tracks.push(this.getRandomTrackFromList(highRotation));
      } else if (i % 4 === 0 || i % 7 === 0) {
        tmpPlaylist.tracks.push(this.getRandomTrackFromList(mediumRotation));
      } else {
        tmpPlaylist.tracks.push(this.getRandomTrackFromList(this.core.artistsList()));
      }
    }
    return tmpPlaylist;
  }

  public getRandomTrackFromList(list: Artist[]): Track {
    const randomArtist: Artist = this.shuffle(list)[0];
    if (randomArtist) {
      const randomAlbum: Album = this.shuffle(randomArtist.albums)[0];
      const randomTrack: Track = this.shuffle(randomAlbum.tracks)[0];
      if (randomTrack.duration <= 1000 * 60 * 10) {
        // only use 'small' tracks to prevent boredom or concerts
        return randomTrack;
      } else {
        return this.getRandomTrackFromList(list);
      }
    } else {
      // artist not found, get another one!
      return this.getRandomTrackFromList(list);
    }
  }
  public shuffle(list: any[]): any[] {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = list[i];
      list[i] = list[j];
      list[j] = temp;
    }
    return list;
  }
  public getNextTrackForPlaylist(foundSimilair: Artist[], playlist: any): Track {
    const nextTrack = this.getRandomTrackFromList(foundSimilair);
    if (nextTrack) {
      const nextArtist = nextTrack.artist;
      // if the last added track is a track by the same artist we'd like a different artist (if we can!)
      if (playlist.tracks.length > 1 && playlist.tracks[playlist.tracks.length - 1].artist === nextArtist && foundSimilair.length > 1) {
        // do stuff again with foundSimilair
        return this.getNextTrackForPlaylist(foundSimilair, playlist);
      }
      return nextTrack;
    }
    return null;
  }
}
