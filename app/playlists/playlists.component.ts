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
import * as _ from 'lodash';

@Component({
  templateUrl: 'app/playlists/playlists.component.html',
  pipes: [TimeFormatPipe],
  directives: [TrackListComponent],
  providers: [ LastFMService ],
  styleUrls: ['app/playlists/playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  private subscription: Subscription;
  private playlist;
  private currentPlaylist;
  private track;
  private trackIndex;
  private core:musicdbcore;

  constructor(private pathService: PathService, private coreService: CoreService, private router: Router, private playerService: PlayerService, private lastfmservice:LastFMService) {
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
  setPlaylist(name:string) {
    if (name === "current") {
      this.playlist = this.currentPlaylist;
    } else if (name === 'last.fm') {
      this.lastfmservice.getLovedTracks('arielext').subscribe(
        data => {
          this.playlist = this.extractTracks(data);
        }
      )
    } else if (name === 'random') {
      this.playlist = this.generateRandom();
    } else {
      console.log('unknown playlist', name);
    }
  }
  extractTracks(data:Array<any>):any {
    let tmpPlaylist = {
      name: "Loved tracks on Last.FM",
      tracks: []
    }
    let c = this;
    _.each(data, function(line) {
      let artistName:string = line.artist.name;
      let trackName:string = line.name;
      let track:any = c.core.getTrackByArtistAndName(artistName, trackName);
      if (track) {
        tmpPlaylist.tracks.push(track);
      }
    });
    return tmpPlaylist;
  }
  generateRandom():any {
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
}