import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { SharedModule } from "../utils/shared/shared.module";
import { NowPlayingRoutingModule } from "./now-playing-routing.module";
import { NowPlayingComponent } from "./now-playing/now-playing.component";

@NgModule({
  declarations: [NowPlayingComponent],
  imports: [CommonModule, NowPlayingRoutingModule, SharedModule, FormsModule]
})
export class NowPlayingModule {}
