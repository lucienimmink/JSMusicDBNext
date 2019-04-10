import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LetterDetailRoutingModule } from "./letter-detail-routing.module";
import { LetterDetailComponent } from "./letter-detail/letter-detail.component";
import { SharedModule } from "../utils/shared/shared.module";

@NgModule({
  declarations: [LetterDetailComponent],
  imports: [CommonModule, LetterDetailRoutingModule, SharedModule]
})
export class LetterDetailModule {}
