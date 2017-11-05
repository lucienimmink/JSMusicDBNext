import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { LastfmService } from './../utils/lastfm.service';
import { CoreService } from './../utils/core.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import Artist from './../org/arielext/musicdb/models/Artist';
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import { Playlist } from './playlist';

@Injectable()
export class PlaylistService {

  private core: musicdbcore;
  private username: string = localStorage.getItem('lastfm-username');
  private playlist: Playlist;
  private playlistSubject: Subject<any> = new Subject<any>();
  public playlistAnnounced$ = this.playlistSubject.asObservable();

  constructor(private coreService: CoreService, private lastfmservice: LastfmService) {
    this.core = this.coreService.getCore();
  };

  generateRandom(): any {
    let coretracknames = Object.keys(this.core.tracks);
    let randomTracks: Array<string> = this.shuffle(coretracknames).splice(0, 50);
    let tmpPlaylist: Playlist = new Playlist();
    tmpPlaylist.name = "50 random tracks";
    randomTracks.map((id) => {
      tmpPlaylist.tracks.push(this.core.tracks[id]);
    });
    return tmpPlaylist;
  }

  generateRadio(): any {
    this.lastfmservice.getTopArtists(this.username).subscribe(
      data => {
        this.playlistSubject.next(this.extractArtists(data));
      }
    )
  }

  extractArtists(data: Array<any>): Playlist {
    let c = this;
    let highRotation: Array<Artist> = [];
    let mediumRotation: Array<Artist> = [];
    data.map((line, index) => {
      let artistName: string = line.name;
      line.dummy = true // use dummy artist for lookup;
      let artist: Artist = new Artist(line);
      let foundArtist: Artist = c.core.artists[artist.sortName];
      if (foundArtist && index < 10) {
        highRotation.push(foundArtist);
      } else {
        mediumRotation.push(foundArtist);
      }
    });
    return this.generateRadioList(highRotation, mediumRotation);
  }

  generateRadioList(highRotation: Array<Artist>, mediumRotation: Array<Artist>): Playlist {
    let tmpPlaylist: Playlist = new Playlist();
    tmpPlaylist.name = "Random based on your preferences";

    let c = this;
    for (let i = 0; i < 50; i++) {
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

  private getRandomTrackFromList(list: Array<Artist>): Track {
    let randomArtist: Artist = this.shuffle(list)[0];
    if (randomArtist) {
      let randomAlbum: Album = this.shuffle(randomArtist.albums)[0];
      let randomTrack: Track = this.shuffle(randomAlbum.tracks)[0];
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
  private shuffle(array: Array<any>) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}