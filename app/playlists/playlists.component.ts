import { Component, OnInit } from "@angular/core";
import { PlayerService } from './../player/player.service';
import { PathService } from './../utils/path.service';
import { CoreService } from './../core.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { TimeFormatPipe } from './../timeformat.pipe';
import { Router } from '@angular/router-deprecated';
import { TrackListComponent } from './../track/tracklist.component';
import { Subscription }   from 'rxjs/Subscription';
import { LastFMService } from './../lastfm/lastfm.service';
import Artist from './../org/arielext/musicdb/models/Artist';
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import * as _ from 'lodash';

@Component({
  templateUrl: 'app/playlists/playlists.component.html',
  pipes: [TimeFormatPipe],
  directives: [TrackListComponent],
  providers: [LastFMService],
  styleUrls: ['app/playlists/playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  private subscription: Subscription;
  private playlist;
  private currentPlaylist;
  private track;
  private trackIndex;
  private core: musicdbcore;
  private loading: boolean = false;

  constructor(private pathService: PathService, private coreService: CoreService, private router: Router, private playerService: PlayerService, private lastfmservice: LastFMService) {
    // this is for when we open the page; just wanting to know the current state of the playerService
    let playerData = this.playerService.getCurrentPlaylist();
    if (playerData) {
      this.currentPlaylist = playerData.playlist;
      this.trackIndex = playerData.startIndex;
      this.setTrack();
    }
    // this is for when a new track is announced while we are already on the page
    this.subscription = this.playerService.playlistAnnounced$.subscribe(
      playerData => {
        this.currentPlaylist = playerData.playlist;
        this.trackIndex = playerData.startIndex;
        this.setTrack();
      }
    )
  }

  setTrack() {
    this.track = this.currentPlaylist.tracks[this.trackIndex];
    this.track.position = 0;
  }

  ngOnInit() {
    this.pathService.announcePage('Playlists');
    this.core = this.coreService.getCore();
  }
  setPlaylist(name: string) {
    this.loading = true;
    if (name === "current") {
      this.playlist = this.currentPlaylist;
      this.loading = false;
    } else if (name === 'last.fm') {
      this.lastfmservice.getLovedTracks('arielext').subscribe(
        data => {
          this.playlist = this.extractTracks(data);
          this.loading = false;
        }
      )
    } else if (name === 'random') {
      this.playlist = this.generateRandom();
      this.loading = false;
    } else if (name === 'radio') {
      this.playlist = this.generateRadio();
    } else {
      console.log('unknown playlist', name);
    }
  }
  extractTracks(data: Array<any>): any {
    let tmpPlaylist = {
      name: "Loved tracks on Last.FM",
      tracks: []
    }
    let c = this;
    _.each(data, function (line) {
      let artistName: string = line.artist.name;
      let trackName: string = line.name;
      let track: any = c.core.getTrackByArtistAndName(artistName, trackName);
      if (track) {
        tmpPlaylist.tracks.push(track);
      }
    });
    return tmpPlaylist;
  }
  generateRandom(): any {
    let coretracknames = Object.keys(this.core.tracks);
    let randomTracks = _.shuffle(coretracknames).splice(0, 50);
    let tmpPlaylist = {
      name: "50 random tracks",
      tracks: []
    }
    let c = this;
    _.each(randomTracks, function (id) {
      tmpPlaylist.tracks.push(c.core.tracks[id]);
    });
    return tmpPlaylist;
  }
  generateRadio(): any {
    this.lastfmservice.getTopArtists('arielext').subscribe(
      data => {
        this.playlist = this.extractArtists(data);
        this.loading = false;
      }
    )
  }
  extractArtists(data: Array<any>):any {
    let c = this;
    let highRotation:Array<Artist> = [];
    let mediumRotation:Array<Artist> = [];
    _.each(data, function (line, index) {
      let artistName: string = line.name;
      let artist:Artist = new Artist(line);
      let foundArtist:Artist = c.core.artists[artist.sortName];
      if (foundArtist && index < 10) {
        highRotation.push(foundArtist);
      } else {
        mediumRotation.push(foundArtist);
      }
    });
    return this.generateRadioList(highRotation, mediumRotation);
  }
  generateRadioList(highRotation:Array<Artist>, mediumRotation:Array<Artist>) {
    let tmpPlaylist = {
      name: "Random based on your preferences",
      tracks: []
    }
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
  private getRandomTrackFromList(list:Array<Artist>):Track {
    let randomArtist:Artist = _.shuffle(list)[0];
    let randomAlbum:Album = _.shuffle(randomArtist.albums)[0];
    let randomTrack:Track = _.shuffle(randomAlbum.tracks)[0];
    return randomTrack;
  }
}