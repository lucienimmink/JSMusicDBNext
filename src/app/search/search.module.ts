import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "../utils/shared/shared.module";
import { SearchRoutingModule } from "./search-routing.module";
import { SearchComponent } from "./search/search.component";

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, SearchRoutingModule, SharedModule]
})
export class SearchModule {}
