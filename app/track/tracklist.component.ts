import { Component, Input } from "@angular/core";
import { PlayerService } from "./../player/player.service";
import { TimeFormatPipe } from './../timeformat.pipe';

import Track from './../org/arielext/musicdb/models/track';
import { Playlist } from './../playlists/Playlist';

@Component({
    selector: 'mdb-tracklist',
    templateUrl: 'app/track/tracklist.component.html',
    styleUrls: ['dist/track/tracklist.component.css']
})
export class TrackListComponent {
    @Input() playlist: any = {};
    private isBusy:boolean = false;
    private ownPlaylists:Array<Playlist>;

    constructor(private playerservice: PlayerService) {
        // TODO this should a call from the backend
        this.ownPlaylists = [];
        if (localStorage.getItem('customlisttest')) {
            let list: Array<Playlist> = JSON.parse(localStorage.getItem('customlisttest'));
            if (list) {
                list.forEach(item => {
                    let playlist = new Playlist();
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
    removeFromPlaylist(playlist:Playlist, track: Track) {
        this.isBusy = true;
        setTimeout(() => {
            this.isBusy = false;
        }, 5);

        // this should be handled on the server; oh and a playlist should be identified by the ID not the name!
        this.ownPlaylists.forEach((splaylist) => {
            if (playlist.name === splaylist.name) {
                let toRemove = playlist.tracks.indexOf(track);
                playlist.tracks.splice(toRemove, 1);
                splaylist.tracks.splice(toRemove, 1);
            }
        });
        localStorage.setItem('customlisttest', JSON.stringify(this.ownPlaylists));
    }
}