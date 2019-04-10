import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PlaylistsComponent } from "./playlists/playlists.component";

const routes: Routes = [
  {
    path: "",
    component: PlaylistsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaylistsRoutingModule {}
