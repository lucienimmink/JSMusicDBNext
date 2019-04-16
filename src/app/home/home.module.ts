import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { RecentlyListenedService } from "../utils/recently-listened.service";
import { SharedModule } from "../utils/shared/shared.module";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home/home.component";

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule, FormsModule],
  providers: [RecentlyListenedService]
})
export class HomeModule {}
