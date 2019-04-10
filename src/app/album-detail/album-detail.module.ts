import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AlbumDetailRoutingModule } from "./album-detail-routing.module";
import { AlbumDetailComponent } from "./album-detail/album-detail.component";
import { SharedModule } from "../utils/shared/shared.module";

@NgModule({
  declarations: [AlbumDetailComponent],
  imports: [CommonModule, AlbumDetailRoutingModule, SharedModule]
})
export class AlbumDetailModule {}
