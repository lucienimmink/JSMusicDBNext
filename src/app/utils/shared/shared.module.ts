import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlbumComponent } from "../../album/album/album.component";
import { ArtistComponent } from "../../artist/artist/artist.component";
import { TrackComponent } from "../../track/track/track.component";
import { TimeFormatPipe } from "../../utils/time-format.pipe";
import { AlbumArtComponent } from "../album-art/album-art.component";
import { BackgroundArtDirective } from "../background-art.directive";
import { VsForDirective } from "../vs-for.directive";

@NgModule({
  declarations: [AlbumComponent, BackgroundArtDirective, VsForDirective, ArtistComponent, TrackComponent, TimeFormatPipe, AlbumArtComponent],
  imports: [CommonModule],
  exports: [AlbumComponent, BackgroundArtDirective, VsForDirective, ArtistComponent, TrackComponent, TimeFormatPipe, AlbumArtComponent],
})
export class SharedModule {}
