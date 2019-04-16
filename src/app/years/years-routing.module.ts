import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { YearsComponent } from "./years/years.component";

const routes: Routes = [
  {
    path: "",
    component: YearsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YearsRoutingModule {}
