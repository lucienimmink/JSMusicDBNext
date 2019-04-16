import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LettersComponent } from "./letters/letters.component";

const routes: Routes = [
  {
    path: "",
    component: LettersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LettersRoutingModule {}
