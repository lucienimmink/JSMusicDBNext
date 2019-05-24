import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Album from './../../org/arielext/musicdb/models/Album';
import { BackgroundArtDirective } from './../../utils/background-art.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mdb-album',
  templateUrl: './album.component.html'
})
export class AlbumComponent {
  @Input() public album: Album;
  @ViewChild(BackgroundArtDirective, {static: false}) public backgroundArtDirective: BackgroundArtDirective;

  constructor(private router: Router) { }

  public select() {
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['letter', this.album.artist.letter.escapedLetter, 'artist', this.album.artist.sortName, 'album', this.album.sortName]);
  }
}
