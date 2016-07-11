import { Component, Input } from "@angular/core";
import { PlayerService} from "./../player/player.service";
import { TimeFormatPipe } from './../timeformat.pipe';

@Component({
  selector: 'mdb-tracklist',
  templateUrl: 'app/track/tracklist.component.html',
  pipes: [ TimeFormatPipe ],
  styleUrls: [ 'dist/track/tracklist.component.css' ]
})
export class TrackListComponent {
    @Input() playlist:any = {};

    constructor(private playerservice:PlayerService) {}

    select(track:any) {
        this.playerservice.doPlayAlbum(this.playlist, this.playlist.tracks.indexOf(track));
    }
}