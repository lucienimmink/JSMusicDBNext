import { Component, Input, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';

@Component({
    selector: 'mdbalbum',
    templateUrl: './album.component.html'
})
export class AlbumComponent {
    @Input() album: any = {};
    @ViewChild(BackgroundArtDirective) backgroundArt: BackgroundArtDirective;

    constructor(private router: Router) { }

    select() {
        this.router.navigate(['letter', this.album.artist.letter.escapedLetter, 'artist', this.album.artist.sortName, 'album', this.album.sortName]);
    }
}