import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "../utils/shared/shared.module";
import { LetterDetailRoutingModule } from "./letter-detail-routing.module";
import { LetterDetailComponent } from "./letter-detail/letter-detail.component";

@NgModule({
  declarations: [LetterDetailComponent],
  imports: [CommonModule, LetterDetailRoutingModule, SharedModule]
})
export class LetterDetailModule {}
