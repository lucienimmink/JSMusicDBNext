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

    constructor(private playerservice: PlayerService) { }

    select(track: Track) {
        this.playerservice.doPlayAlbum(this.playlist, this.playlist.tracks.indexOf(track));
    }
}