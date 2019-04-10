import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ArtistsRoutingModule } from "./artists-routing.module";
import { ArtistsComponent } from "./artists/artists.component";
import { SharedModule } from "../utils/shared/shared.module";

@NgModule({
  declarations: [ArtistsComponent],
  imports: [CommonModule, ArtistsRoutingModule, SharedModule]
})
export class ArtistsModule {}
