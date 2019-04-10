import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ScrobbleCacheComponent } from "./scrobble-cache/scrobble-cache.component";

const routes: Routes = [
  {
    path: "",
    component: ScrobbleCacheComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScrobbleCacheRoutingModule {}
