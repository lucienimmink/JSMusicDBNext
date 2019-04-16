import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { SharedModule } from "../utils/shared/shared.module";
import { PlaylistsRoutingModule } from "./playlists-routing.module";
import { PlaylistsComponent } from "./playlists/playlists.component";

@NgModule({
  declarations: [PlaylistsComponent],
  imports: [CommonModule, PlaylistsRoutingModule, SharedModule, FormsModule]
})
export class PlaylistsModule {}
