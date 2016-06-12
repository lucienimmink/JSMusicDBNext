import { Component, Input } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';

@Component({
  selector: 'mdbalbum',
  templateUrl: 'app/album/album.component.html',
  directives: [ BackgroundArtDirective ],
  styleUrls: [ 'app/album/album.component.css' ]
})
export class AlbumComponent {
    @Input() album:any = {};
    
    constructor(private router:Router) {}

    select() {
        this.router.navigate(['Album', { letter: this.album.artist.letter.escapedLetter, artist: this.album.artist.sortName, album: this.album.sortName }]);
    }
}