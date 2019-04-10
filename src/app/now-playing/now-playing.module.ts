import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { NowPlayingRoutingModule } from "./now-playing-routing.module";
import { NowPlayingComponent } from "./now-playing/now-playing.component";
import { SharedModule } from "../utils/shared/shared.module";

@NgModule({
  declarations: [NowPlayingComponent],
  imports: [CommonModule, NowPlayingRoutingModule, SharedModule, FormsModule]
})
export class NowPlayingModule {}
