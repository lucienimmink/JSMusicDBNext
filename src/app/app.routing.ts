import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AlbumDetailComponent } from "./album/album-detail/album-detail.component";
// import { AlbumsComponent } from "./album/albums/albums.component";
import { ArtistDetailComponent } from "./artist/artist-detail/artist-detail.component";
import { ArtistsComponent } from "./artist/artists/artists.component";
// import { HomeComponent } from "./home/home.component";
import { LetterDetailComponent } from "./letter/letter-detail/letter-detail.component";
import { LettersComponent } from "./letter/letters/letters.component";
// import { LoginComponent } from "./login/login.component";
import { NowPlayingComponent } from "./now-playing/now-playing/now-playing.component";
import { PlaylistComponent } from "./playlist/playlist/playlist.component";
import { ScrobbleCacheComponent } from "./scrobble-cache/scrobble-cache/scrobble-cache.component";
import { SearchComponent } from "./search/search/search.component";
import { SettingsComponent } from "./settings/settings/settings.component";
import { YearComponent } from "./year/year/year.component";

import { LoginService } from "./login/login.service";
import { AuthGuardService } from "./utils/authguard.service";

const appRoutes: Routes = [
  { path: "login", loadChildren: "./login/login.module#LoginModule" },
  { path: "home", loadChildren: "./home/home.module#HomeModule", canActivate: [AuthGuardService] },
  { path: "letters", component: LettersComponent, canActivate: [AuthGuardService] },
  { path: "artists", component: ArtistsComponent, canActivate: [AuthGuardService] },
  { path: "albums", loadChildren: "./albums/albums.module#AlbumsModule", canActivate: [AuthGuardService] },
  { path: "years", component: YearComponent, canActivate: [AuthGuardService] },
  { path: "playlists", component: PlaylistComponent, canActivate: [AuthGuardService] },
  { path: "now-playing", component: NowPlayingComponent, canActivate: [AuthGuardService] },
  { path: "settings", component: SettingsComponent, canActivate: [AuthGuardService] },
  { path: "scrobble-cache", component: ScrobbleCacheComponent, canActivate: [AuthGuardService] },
  { path: "search/:query", component: SearchComponent, canActivate: [AuthGuardService] },
  { path: "letter/:letter", component: LetterDetailComponent, canActivate: [AuthGuardService] },
  { path: "letter/:letter/artist/:artist", component: ArtistDetailComponent, canActivate: [AuthGuardService] },
  { path: "letter/:letter/artist/:artist/album/:album", component: AlbumDetailComponent, canActivate: [AuthGuardService] },
  { path: "", loadChildren: "./home/home.module#HomeModule", canActivate: [AuthGuardService] }
];

export const appRoutingProviders: any[] = [AuthGuardService, LoginService];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
