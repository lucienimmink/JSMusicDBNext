import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AlbumComponent } from "../../album/album/album.component";
import { BackgroundArtDirective } from "../background-art.directive";
import { VsForDirective } from "../vs-for.directive";

@NgModule({
  declarations: [AlbumComponent, BackgroundArtDirective, VsForDirective],
  imports: [CommonModule],
  exports: [AlbumComponent, BackgroundArtDirective, VsForDirective]
})
export class SharedModule {}
