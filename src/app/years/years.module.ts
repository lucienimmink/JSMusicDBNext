import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { YearsRoutingModule } from "./years-routing.module";
import { YearsComponent } from "./years/years.component";
import { SharedModule } from "../utils/shared/shared.module";

@NgModule({
  declarations: [YearsComponent],
  imports: [CommonModule, YearsRoutingModule, SharedModule]
})
export class YearsModule {}
