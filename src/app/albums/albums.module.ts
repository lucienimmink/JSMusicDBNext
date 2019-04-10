import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AlbumsRoutingModule } from "./albums-routing.module";
import { AlbumsListComponent } from "./albums-list/albums-list.component";

import { SharedModule } from ".././utils/shared/shared.module";

@NgModule({
  declarations: [AlbumsListComponent],
  imports: [CommonModule, AlbumsRoutingModule, SharedModule]
})
export class AlbumsModule {}
