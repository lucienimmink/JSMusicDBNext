import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NowPlayingComponent } from "./now-playing/now-playing.component";

const routes: Routes = [
  {
    path: "",
    component: NowPlayingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NowPlayingRoutingModule {}
