import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home/home.component";
import { SharedModule } from "../utils/shared/shared.module";
import { RecentlyListenedService } from "../utils/recently-listened.service";

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule, FormsModule],
  providers: [RecentlyListenedService]
})
export class HomeModule {}
