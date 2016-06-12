import { Component, ViewChild, OnInit, Input } from "@angular/core";
import { AlbumArt } from './../utils/albumart.component';

@Component({
  selector: 'mdbalbum',
  templateUrl: 'app/album/album.component.html',
  directives: [ AlbumArt ],
  styleUrls: [ 'app/album/album.component.css' ]
})
export class AlbumComponent implements OnInit {
    @Input()
    album:any = {};

    @ViewChild(AlbumArt)
 	private albumart:AlbumArt;

    constructor() {}

    ngOnInit() {
        let c = this;
        setTimeout(function () {
            console.log('nginit');
            if (c.album) {
                c.albumart.setAlbum(c.album);
            }
        }, 0);
    }
}