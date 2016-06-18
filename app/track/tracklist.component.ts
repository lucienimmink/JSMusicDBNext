import { Component, Input } from "@angular/core";
import { TimeFormatPipe } from './../timeformat.pipe';

@Component({
  selector: 'mdb-tracklist',
  templateUrl: 'app/track/tracklist.component.html',
  pipes: [ TimeFormatPipe ],
  styleUrls: [ 'app/track/tracklist.component.css' ]
})
export class TrackListComponent {
    @Input() playlist:any = {};
    
    constructor() {}

    select() {
        // TODO: send player event
    }
}