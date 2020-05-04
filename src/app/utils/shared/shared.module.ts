import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { AlbumComponent } from "../../album/album/album.component";
import { ArtistComponent } from "../../artist/artist/artist.component";
import { TrackComponent } from "../../track/track/track.component";
import { TimeFormatPipe } from "../../utils/time-format.pipe";
import { VsForDirective } from "../vs-for.directive";

@NgModule({
  declarations: [AlbumComponent, VsForDirective, ArtistComponent, TrackComponent, TimeFormatPipe],
  imports: [CommonModule],
  exports: [AlbumComponent, VsForDirective, ArtistComponent, TrackComponent, TimeFormatPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
