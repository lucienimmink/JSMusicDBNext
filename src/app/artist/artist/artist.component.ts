import { Component, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import Artist from "./../../org/arielext/musicdb/models/Artist";
import { BackgroundArtDirective } from "./../../utils/background-art.directive";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "mdb-artist",
  templateUrl: "./artist.component.html",
})
export class ArtistComponent {
  @Input() public artist: Artist;
  @ViewChild(BackgroundArtDirective, { static: false })
  public backgroundArt: BackgroundArtDirective;

  constructor(private router: Router) {}

  public select() {
    this.router.navigate(["letter", this.artist.letter.escapedLetter, "artist", this.artist.sortName]);
  }
}
