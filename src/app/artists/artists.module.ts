import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "../utils/shared/shared.module";
import { ArtistsRoutingModule } from "./artists-routing.module";
import { ArtistsComponent } from "./artists/artists.component";

@NgModule({
  declarations: [ArtistsComponent],
  imports: [CommonModule, ArtistsRoutingModule, SharedModule]
})
export class ArtistsModule {}
