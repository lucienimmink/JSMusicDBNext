import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "../utils/shared/shared.module";
import { YearsRoutingModule } from "./years-routing.module";
import { YearsComponent } from "./years/years.component";

@NgModule({
  declarations: [YearsComponent],
  imports: [CommonModule, YearsRoutingModule, SharedModule]
})
export class YearsModule {}
