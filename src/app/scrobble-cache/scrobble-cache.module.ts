import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "../utils/shared/shared.module";
import { ScrobbleCacheRoutingModule } from "./scrobble-cache-routing.module";
import { ScrobbleCacheComponent } from "./scrobble-cache/scrobble-cache.component";

@NgModule({
  declarations: [ScrobbleCacheComponent],
  imports: [CommonModule, ScrobbleCacheRoutingModule, SharedModule]
})
export class ScrobbleCacheModule {}
