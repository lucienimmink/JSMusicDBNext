import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ArtistsComponent } from "./artists/artists.component";

const routes: Routes = [
  {
    path: "",
    component: ArtistsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistsRoutingModule {}
