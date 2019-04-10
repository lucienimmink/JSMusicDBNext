import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ArtistDetailComponent } from "./artist-detail/artist-detail.component";

const routes: Routes = [
  {
    path: "",
    component: ArtistDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistDetailRoutingModule {}
