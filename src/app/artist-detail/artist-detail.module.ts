import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ArtistDetailRoutingModule } from "./artist-detail-routing.module";
import { ArtistDetailComponent } from "./artist-detail/artist-detail.component";
import { SharedModule } from "../utils/shared/shared.module";

@NgModule({
  declarations: [ArtistDetailComponent],
  imports: [CommonModule, ArtistDetailRoutingModule, SharedModule]
})
export class ArtistDetailModule {}
