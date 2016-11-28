import { Component, Input } from "@angular/core";
import { PlayerService } from "./../player/player.service";
import { TimeFormatPipe } from './../timeformat.pipe';

import Track from './../org/arielext/musicdb/models/track';

@Component({
    selector: 'mdb-tracklist',
    templateUrl: 'app/track/tracklist.component.html',
    styleUrls: ['dist/track/tracklist.component.css']
})
export class TrackListComponent {
    @Input() playlist: any = {};
    private isBusy:boolean = false;

    constructor(private playerservice: PlayerService) { }

    select(track: Track) {
        if (!this.isBusy) {
            this.playerservice.doPlayAlbum(this.playlist, this.playlist.tracks.indexOf(track));
        }
    }
    removeFromPlaylist(track: Track) {
        this.isBusy = true;
        setTimeout(() => {
            this.isBusy = false;
        }, 5);
    }
}