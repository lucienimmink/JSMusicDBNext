import { Component, ViewChild, Input } from "@angular/core";
import { ArtistArtDirective } from './../utils/artistart.directive';

@Component({
  selector: 'mdbartist',
  templateUrl: 'app/artist/artist.component.html',
  directives: [ ArtistArtDirective ],
  styleUrls: [ 'app/artist/artist.component.css' ]
})
export class ArtistComponent {
    @Input() artist:any = {};
    constructor() {}
}