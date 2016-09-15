import { Component, Input, NgModule } from "@angular/core";
import { PlayerService} from "./../player/player.service";
import { TimeFormatPipe } from './../timeformat.pipe';

@NgModule({
    declarations: [ TimeFormatPipe ]
})
@Component({
  selector: 'mdb-tracklist',
  templateUrl: 'app/track/tracklist.component.html',
  styleUrls: [ 'dist/track/tracklist.component.css' ]
})
export class TrackListComponent {
    @Input() playlist:any = {};

    constructor(private playerservice:PlayerService) {}

    select(track:any) {
        this.playerservice.doPlayAlbum(this.playlist, this.playlist.tracks.indexOf(track));
    }
}