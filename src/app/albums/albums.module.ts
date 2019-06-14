import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { AlbumsListComponent } from "./albums-list/albums-list.component";
import { AlbumsRoutingModule } from "./albums-routing.module";

import { SharedModule } from ".././utils/shared/shared.module";

@NgModule({
  declarations: [AlbumsListComponent],
  imports: [CommonModule, AlbumsRoutingModule, SharedModule, ScrollingModule],
})
export class AlbumsModule {}
