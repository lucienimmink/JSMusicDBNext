import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
//import { ModalDirective } from 'ngx-bootstrap';

import { PlayerService } from './../../player/player.service';
import { PathService } from './../../utils/path.service';
import { CoreService } from './../../utils/core.service';
import { musicdbcore } from './../../org/arielext/musicdb/core';
import { TimeFormatPipe } from './../../utils/time-format.pipe';
import { TrackComponent } from './../../track/track/track.component';
import { LastfmService } from './../../utils/lastfm.service';
import { ConfigService } from './../../utils/config.service';
import { PlaylistService } from './../playlist.service';
import { Playlist } from './../playlist';
import Artist from './../../org/arielext/musicdb/models/Artist';
import Album from './../../org/arielext/musicdb/models/Album';
import Track from './../../org/arielext/musicdb/models/Track';

@Component({
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  private subscription: Subscription;
  private subscription2: Subscription;
  public playlist: Playlist;
  public currentPlaylist: any;
  private newPlaylist: Playlist;
  private track: Track;
  private trackIndex: number;
  private core: musicdbcore;
  public loading: boolean = false;
  public username: string = localStorage.getItem('lastfm-username');
  public showStartingArtist: boolean = false;
  private artists: Array<Artist> = [];
  private startingArtistName: string;
  private theme: string;
  //@ViewChild('addModal') private addModal: ModalDirective;
  //@ViewChild('editModal') private editModal: ModalDirective;
  public ownPlaylists: Array<Playlist> = [];

  constructor(private pathService: PathService, private coreService: CoreService, private router: Router, private playerService: PlayerService, private lastfmservice: LastfmService, private configService: ConfigService, public playlistService:PlaylistService) {
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
    this.core = this.coreService.getCore();
    this.subscription2 = this.core.coreParsed$.subscribe(
      data => {
        this.ngOnInit();
      }
    )
    this.theme = configService.mode;
    this.newPlaylist = new Playlist();
  }

  setTrack() {
    this.track = this.currentPlaylist.tracks[this.trackIndex];
    if (this.track) {
      this.track.position = 0;
    }
  }

  ngOnInit() {
    this.pathService.announcePage('Playlists');
    this.artists = this.core.artistsList();
    this.ownPlaylists = [];

    // TODO this should a call from the backend
    if (localStorage.getItem('customlisttest')) {
      let list: Array<any> = JSON.parse(localStorage.getItem('customlisttest'));
      if (list) {
        list.forEach(item => {
          let playlist = new Playlist();
          playlist.name = item.name;
          playlist.isOwn = true;
          item.tracks.forEach(id => {
            let track: Track = this.core.getTrackById(id);
            if (track && track.title) {
              playlist.tracks.push(track)
            }
          });

          this.ownPlaylists.push(playlist);
        });
      }
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
  
  setPlaylist(name: any) {
    this.loading = true;
    this.showStartingArtist = false;
    if (name === "current") {
      this.playlist = this.currentPlaylist;
      this.loading = false;
    } else if (name === 'last.fm') {
      this.lastfmservice.getLovedTracks(this.username).subscribe(
        data => {
          this.playlist = this.playlistService.extractTracks(data);
          this.loading = false;
        }
      )
    } else if (name === 'random') {
      this.playlist = this.playlistService.generateRandom();
      this.playlist.isContinues = true;
      this.playlist.type = name;
      this.loading = false;
    } else if (name === 'radio') {
      this.playlist = this.generateRadio();
    } else if (name === 'artist') {
      this.askForStartingArtist();
    } else if (name instanceof Playlist) {
      this.playlist = name;
      this.loading = false;
    } else {
      console.log('unknown playlist', name);
    }
  }
  generateRadio(): any {
    this.lastfmservice.getTopArtists(this.username).subscribe(
      data => {
        this.playlist = this.playlistService.extractArtists(data);
        this.playlist.isContinues = true;
        this.playlist.type = 'radio';
        this.loading = false;
      }
    )
  }
  private askForStartingArtist(): void {
    this.loading = false;
    this.playlist = null;
    this.showStartingArtist = true;
  }
  onChange() {
    let startArtist = this.core.getArtistByName(this.startingArtistName);
    let tmpPlaylist: Playlist = new Playlist();
    tmpPlaylist.name = `Artist radio for ${startArtist.name}`;
    tmpPlaylist.tracks = [this.playlistService.getRandomTrackFromList([startArtist])];

    this.showStartingArtist = false;
    this.playlist = tmpPlaylist;

    this.getNextSimilairArtist(startArtist, this.playlist);

  }
  getNextSimilairArtist(artist: Artist, playlist: any): void {
    // get a similair artist from last.fm
    this.loading = true;
    this.lastfmservice.getSimilairArtists(artist).subscribe(
      data => {
        this.loading = false;
        let c = this;
        let foundSimilair: Array<Artist> = [];
        data.forEach(lastfmartist => {
          let name = lastfmartist.name;
          let coreArtist = c.core.getArtistByName(name)
          if (coreArtist) {
            foundSimilair.push(coreArtist);
          }
        });
        // the next similair artist is ...
        if (foundSimilair.length > 0) {
          let nextTrack = this.playlistService.getNextTrackForPlaylist(foundSimilair, playlist);
          if (nextTrack && playlist.tracks.length < this.playlistService.numberOfTracksInAPlaylist) {
            playlist.tracks.push(nextTrack);
            this.getNextSimilairArtist(nextTrack.artist, playlist);
          }
        }
        // if no new similair artists are found this is the end of the line.
      }
    )
  }
  

  /*
  addPlaylist(): void {
    this.addModal.show();
    this.newPlaylist = new Playlist();
  }

  doAddPlaylist(): void {
    this.addModal.hide();
    // this.playlist = this.newPlaylist;
    this.playlist = new Playlist();
    this.playlist.name = this.newPlaylist.name;
    this.playlist.isOwn = true; // set to true so we can alter the name
    this.ownPlaylists.push(this.playlist);
    this.showStartingArtist = false;

    // TODO: this should be a call to the backend
    localStorage.setItem('customlisttest', JSON.stringify(this.ownPlaylists));
  }

  updatePlaylist(playlist: Playlist): void {
    this.newPlaylist = new Playlist();
    this.newPlaylist.name = playlist.name;
    this.newPlaylist.tracks = playlist.tracks;
    this.newPlaylist.isOwn = true;

    this.editModal.show();
  }

  doUpdatePlaylist(): void {
    this.editModal.hide();
    this.playlist.name = this.newPlaylist.name;

    // TODO: this should be a call to the backend
    localStorage.setItem('customlisttest', JSON.stringify(this.ownPlaylists));
  }

  removePlaylist(playlist: Playlist): void {
    let index = this.ownPlaylists.indexOf(playlist);
    this.ownPlaylists.splice(index, 1);
    this.playlist = null;

    // TODO: this should be a call to the backend
    localStorage.setItem('customlisttest', JSON.stringify(this.ownPlaylists));
  }
  */
}