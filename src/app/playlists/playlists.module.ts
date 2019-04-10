import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { PlaylistsRoutingModule } from "./playlists-routing.module";
import { PlaylistsComponent } from "./playlists/playlists.component";
import { SharedModule } from "../utils/shared/shared.module";

@NgModule({
  declarations: [PlaylistsComponent],
  imports: [CommonModule, PlaylistsRoutingModule, SharedModule, FormsModule]
})
export class PlaylistsModule {}
