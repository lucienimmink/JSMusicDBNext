import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

import { SharedModule } from "../utils/shared/shared.module";
import { AlbumDetailRoutingModule } from "./album-detail-routing.module";
import { AlbumDetailComponent } from "./album-detail/album-detail.component";

@NgModule({
  declarations: [AlbumDetailComponent],
  imports: [CommonModule, AlbumDetailRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AlbumDetailModule {}
