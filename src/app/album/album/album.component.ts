import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BackgroundArtDirective } from './../../utils/background-art.directive';
import Album from './../../org/arielext/musicdb/models/Album';

@Component({
  selector: 'mdb-album',
  templateUrl: './album.component.html'
})
export class AlbumComponent {
  @Input() album:Album;
  @ViewChild(BackgroundArtDirective) backgroundArtDirective: BackgroundArtDirective;

  constructor(private router:Router) { }

  select() {
    this.router.navigate(['letter', this.album.artist.letter.escapedLetter, 'artist', this.album.artist.sortName, 'album', this.album.sortName]);
  }

}
