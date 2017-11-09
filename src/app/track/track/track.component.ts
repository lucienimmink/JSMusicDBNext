import { Component, Input } from '@angular/core';

import { PlayerService } from './../../player/player.service';
import { TimeFormatPipe } from './../../utils/time-format.pipe';
import { Playlist } from './../../playlist/playlist';
import Track from './../../org/arielext/musicdb/models/track';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mdb-tracklist',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent {
  @Input() playlist: any = {};
  private isBusy = false;
  private ownPlaylists: Array<Playlist>;

  constructor(private playerservice: PlayerService) {
    // TODO this should a call from the backend
    this.ownPlaylists = [];
    if (localStorage.getItem('customlisttest')) {
      const list: Array<Playlist> = JSON.parse(localStorage.getItem('customlisttest'));
      if (list) {
        list.forEach(item => {
          const playlist = new Playlist();
          playlist.isOwn = true;
          playlist.name = item.name;
          playlist.tracks = item.tracks;

          this.ownPlaylists.push(playlist);
        });
      }
    }
  }

  select(track: Track) {
    if (!this.isBusy) {
      this.playerservice.doPlayAlbum(this.playlist, this.playlist.tracks.indexOf(track), true);
    }
  }
  removeFromPlaylist(playlist: Playlist, track: Track) {
    this.isBusy = true;
    setTimeout(() => {
      this.isBusy = false;
    }, 5);

    // this should be handled on the server; oh and a playlist should be identified by the ID not the name!
    this.ownPlaylists.forEach((splaylist) => {
      if (playlist.name === splaylist.name) {
        const toRemove = playlist.tracks.indexOf(track);
        playlist.tracks.splice(toRemove, 1);
        splaylist.tracks.splice(toRemove, 1);
      }
    });
    localStorage.setItem('customlisttest', JSON.stringify(this.ownPlaylists));
  }
}
