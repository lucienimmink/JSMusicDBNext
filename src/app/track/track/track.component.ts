import { Component, Input } from "@angular/core";

import Track from "./../../org/arielext/musicdb/models/Track";
import { PlayerService } from "./../../player/player.service";
import { Playlist } from "./../../playlist/playlist";
import { TimeFormatPipe } from "./../../utils/time-format.pipe";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "mdb-tracklist",
  templateUrl: "./track.component.html"
})
export class TrackComponent {
  @Input() public playlist: any = {};
  private isBusy = false;
  private ownPlaylists: Playlist[];

  constructor(private playerservice: PlayerService) {
    // TODO this should a call from the backend
    this.ownPlaylists = [];
    if (localStorage.getItem("customlisttest")) {
      const list: Playlist[] = JSON.parse(localStorage.getItem("customlisttest"));
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

  public select(track: Track) {
    if (!this.isBusy) {
      this.playerservice.doPlayAlbum(this.playlist, this.playlist.tracks.indexOf(track), true);
    }
  }
  public removeFromPlaylist(playlist: Playlist, track: Track) {
    this.isBusy = true;
    setTimeout(() => {
      this.isBusy = false;
    }, 5);

    // this should be handled on the server; oh and a playlist should be identified by the ID not the name!
    this.ownPlaylists.forEach(splaylist => {
      if (playlist.name === splaylist.name) {
        const toRemove = playlist.tracks.indexOf(track);
        playlist.tracks.splice(toRemove, 1);
        splaylist.tracks.splice(toRemove, 1);
      }
    });
    localStorage.setItem("customlisttest", JSON.stringify(this.ownPlaylists));
  }
}
