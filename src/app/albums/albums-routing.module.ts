import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AlbumsListComponent } from "./albums-list/albums-list.component";

const routes: Routes = [
  {
    path: "",
    component: AlbumsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumsRoutingModule {}
