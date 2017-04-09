import { Component, Input, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';

@Component({
    selector: 'mdb-artist',
    templateUrl: './artist.component.html'
})
export class ArtistComponent {
    @Input() artist: any = {};
    @ViewChild(BackgroundArtDirective) backgroundArt: BackgroundArtDirective;

    constructor(private router: Router) { }

    select() {
        this.router.navigate(['letter', this.artist.letter.escapedLetter, 'artist', this.artist.sortName]);
    }
}