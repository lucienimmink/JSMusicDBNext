import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ScrobbleCacheRoutingModule } from "./scrobble-cache-routing.module";
import { ScrobbleCacheComponent } from "./scrobble-cache/scrobble-cache.component";
import { SharedModule } from "../utils/shared/shared.module";

@NgModule({
  declarations: [ScrobbleCacheComponent],
  imports: [CommonModule, ScrobbleCacheRoutingModule, SharedModule]
})
export class ScrobbleCacheModule {}
