import { Component, Input, ViewChild, NgModule } from "@angular/core";
import { Router } from '@angular/router';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';

@NgModule({
    declarations: [ BackgroundArtDirective ]
})
@Component({
  selector: 'mdb-artist',
  templateUrl: 'app/artist/artist.component.html',
  styleUrls: [ 'dist/artist/artist.component.css' ]
})
export class ArtistComponent {
    @Input() artist:any = {};
    @ViewChild(BackgroundArtDirective) backgroundArt:BackgroundArtDirective;

    constructor(private router: Router) {}

    select() {
        this.router.navigate(['letter', this.artist.letter.escapedLetter, 'artist', this.artist.sortName]);
    }
}