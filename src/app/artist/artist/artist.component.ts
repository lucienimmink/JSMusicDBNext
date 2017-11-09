import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BackgroundArtDirective } from './../../utils/background-art.directive';
import Artist from './../../org/arielext/musicdb/models/Artist';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mdb-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent {
  @Input() artist: Artist;
  @ViewChild(BackgroundArtDirective) backgroundArt: BackgroundArtDirective;

  constructor(private router: Router) { }

  select() {
    this.router.navigate(['letter', this.artist.letter.escapedLetter, 'artist', this.artist.sortName]);
  }
}
