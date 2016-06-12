import { Component, ViewChild, Input } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { ArtistArtDirective } from './../utils/artistart.directive';

@Component({
  selector: 'mdbartist',
  templateUrl: 'app/artist/artist.component.html',
  directives: [ ArtistArtDirective ],
  styleUrls: [ 'app/artist/artist.component.css' ]
})
export class ArtistComponent {
    @Input() artist:any = {};
    constructor(private router: Router) {}
    select() {
        this.router.navigate(['Artist', { letter: this.artist.letter.escapedLetter, artist: this.artist.sortName }]);
    }
}