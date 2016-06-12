import { Component, ViewChild, OnInit, Input } from "@angular/core";
import { ArtistArt } from './../utils/artistart.component';

@Component({
  selector: 'mdbartist',
  templateUrl: 'app/artist/artist.component.html',
  directives: [ ArtistArt ],
  styleUrls: [ 'app/artist/artist.component.css' ]
})
export class ArtistComponent implements OnInit {
    @Input()
    artist:any = {};

    @ViewChild(ArtistArt)
 	private artistart:ArtistArt;

    constructor() {}

    ngOnInit() {
        let c = this;
        setTimeout(function () {
            if (c.artist) {
                c.artistart.setArtist(c.artist);
            }
        }, 0);
    }
}