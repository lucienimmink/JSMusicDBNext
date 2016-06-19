import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { PlayerService } from './../player/player.service';
import { PathService } from './../utils/path.service';
import { CoreService } from './../core.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { TimeFormatPipe } from './../timeformat.pipe';
import { Subscription }   from 'rxjs/Subscription';
import { Router } from '@angular/router-deprecated';
import { TrackListComponent } from './../track/tracklist.component';

@Component({
  templateUrl: 'app/nowPlaying/nowPlaying.component.html',
  pipes: [TimeFormatPipe],
  directives: [BackgroundArtDirective, TrackListComponent],
  styleUrls: ['app/nowPlaying/nowPlaying.component.css']
})
export class NowPlayingComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private playlist;
  private track;
  private trackIndex;
  private previousTrack = {};
  private slided: boolean = false;

  @ViewChild(BackgroundArtDirective) albumart: BackgroundArtDirective;

  constructor(private pathService: PathService, private coreService: CoreService, private playerService: PlayerService, private router: Router) {
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

  ngOnInit() {
    this.pathService.announcePage('Now playing');
    let core: musicdbcore = this.coreService.getCore();

  }

  setTrack() {
    let c = this;
    setTimeout(function () {
      if (c.albumart) c.albumart.ngOnInit();
    });
    this.track = this.playlist.tracks[this.trackIndex];
    this.track.position = 0;
  }
  toggleSlide() {
    this.slided = !this.slided;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // prevent memory leakage
  }
  navigateToArtist() {
    this.router.navigate(['Artist', { letter: this.track.album.artist.letter.escapedLetter, artist: this.track.album.artist.sortName }]);
  }
  navigateToAlbum() {
    this.router.navigate(['Album', { letter: this.track.album.artist.letter.escapedLetter, artist: this.track.album.artist.sortName, album: this.track.album.sortName }]);
  }
}