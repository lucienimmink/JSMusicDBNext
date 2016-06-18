import { Component, OnInit } from "@angular/core";
import { PlayerService } from './../player/player.service';
import { PathService } from './../utils/path.service';
import { CoreService } from './../core.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { TimeFormatPipe } from './../timeformat.pipe';
import { Router } from '@angular/router-deprecated';
import { TrackListComponent } from './../track/tracklist.component';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  templateUrl: 'app/playlists/playlists.component.html',
  pipes: [TimeFormatPipe],
  directives: [TrackListComponent],
  styleUrls: ['app/playlists/playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  private subscription: Subscription;
  private playlist;
  private track;
  private trackIndex;

  constructor(private pathService: PathService, private coreService: CoreService, private router: Router, private playerService: PlayerService) {
    // this is for when we open the page; just wanting to know the current state of the playerService
    let playerData = this.playerService.getCurrentPlaylist();
    if (playerData) {
      this.playlist = playerData.playlist;
      this.trackIndex = playerData.startIndex;
      this.setTrack();
    }
    // this is for when a new track is announced while we are already on the page
    this.subscription = this.playerService.playlistAnnounced$.subscribe(
      playerData => {
        this.playlist = playerData.playlist;
        this.trackIndex = playerData.startIndex;
        this.setTrack();
      }
    )
  }

  setTrack() {
    this.track = this.playlist.tracks[this.trackIndex];
    this.track.position = 0;
  }

  ngOnInit() {
    this.pathService.announcePage('Playlists');
    let core: musicdbcore = this.coreService.getCore();

  }
}