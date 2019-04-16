import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { SharedModule } from "../utils/shared/shared.module";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings/settings.component";

@NgModule({
  declarations: [SettingsComponent],
  imports: [CommonModule, SettingsRoutingModule, FormsModule, SharedModule]
})
export class SettingsModule {}
