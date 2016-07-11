import { Component, Input, ViewChild } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';

@Component({
  selector: 'mdbartist',
  templateUrl: 'app/artist/artist.component.html',
  directives: [ BackgroundArtDirective ],
  styleUrls: [ 'dist/artist/artist.component.css' ]
})
export class ArtistComponent {
    @Input() artist:any = {};
    @ViewChild(BackgroundArtDirective) backgroundArt:BackgroundArtDirective;

    constructor(private router: Router) {}

    select() {
        this.router.navigate(['Artist', { letter: this.artist.letter.escapedLetter, artist: this.artist.sortName }]);
    }
}