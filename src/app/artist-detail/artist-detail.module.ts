import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "../utils/shared/shared.module";
import { ArtistDetailRoutingModule } from "./artist-detail-routing.module";
import { ArtistDetailComponent } from "./artist-detail/artist-detail.component";

@NgModule({
  declarations: [ArtistDetailComponent],
  imports: [CommonModule, ArtistDetailRoutingModule, SharedModule]
})
export class ArtistDetailModule {}
