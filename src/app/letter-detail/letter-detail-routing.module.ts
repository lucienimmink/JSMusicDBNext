import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LetterDetailComponent } from "./letter-detail/letter-detail.component";

const routes: Routes = [
  {
    path: "",
    component: LetterDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LetterDetailRoutingModule {}
