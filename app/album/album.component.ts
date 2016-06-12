import { Component, ViewChild, OnInit, Input } from "@angular/core";
import { Router } from '@angular/router-deprecated';
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

    constructor(private router:Router) {}

    ngOnInit() {
        let c = this;
        setTimeout(function () {
            if (c.album) {
                c.albumart.setAlbum(c.album);
            }
        }, 0);
    }
    select() {
        this.router.navigate(['Album', { letter: this.album.artist.letter.escapedLetter, artist: this.album.artist.sortName, album: this.album.sortName }]);
    }
}