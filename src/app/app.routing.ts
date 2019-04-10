import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// import { AlbumDetailComponent } from "./album/album-detail/album-detail.component";
// import { AlbumsComponent } from "./album/albums/albums.component";
// import { ArtistDetailComponent } from "./artist/artist-detail/artist-detail.component";
// import { ArtistsComponent } from "./artist/artists/artists.component";
// import { HomeComponent } from "./home/home.component";
// import { LetterDetailComponent } from "./letter/letter-detail/letter-detail.component";
// import { LettersComponent } from "./letter/letters/letters.component";
// import { LoginComponent } from "./login/login.component";
import { NowPlayingComponent } from "./now-playing/now-playing-old/now-playing.component";
// import { PlaylistComponent } from "./playlist/playlist/playlist.component";
// import { ScrobbleCacheComponent } from "./scrobble-cache/scrobble-cache/scrobble-cache.component";
// import { SearchComponent } from "./search/search/search.component";
// import { SettingsComponent } from "./settings/settings/settings.component";
// import { YearComponent } from "./year/year/year.component";

import { LoginService } from "./login/login.service";
import { AuthGuardService } from "./utils/authguard.service";

const appRoutes: Routes = [
  { path: "login", loadChildren: "./login/login.module#LoginModule" },
  { path: "home", loadChildren: "./home/home.module#HomeModule", canActivate: [AuthGuardService] },
  { path: "letters", loadChildren: "./letters/letters.module#LettersModule", canActivate: [AuthGuardService] },
  { path: "artists", loadChildren: "./artists/artists.module#ArtistsModule", canActivate: [AuthGuardService] },
  { path: "albums", loadChildren: "./albums/albums.module#AlbumsModule", canActivate: [AuthGuardService] },
  { path: "years", loadChildren: "./years/years.module#YearsModule", canActivate: [AuthGuardService] },
  { path: "playlists", loadChildren: "./playlists/playlists.module#PlaylistsModule", canActivate: [AuthGuardService] },
  { path: "now-playing", loadChildren: "./now-playing/now-playing.module#NowPlayingModule", canActivate: [AuthGuardService] },
  { path: "settings", loadChildren: "./settings/settings.module#SettingsModule", canActivate: [AuthGuardService] },
  { path: "scrobble-cache", loadChildren: "./scrobble-cache/scrobble-cache.module#ScrobbleCacheModule", canActivate: [AuthGuardService] },
  { path: "search/:query", loadChildren: "./search/search.module#SearchModule", canActivate: [AuthGuardService] },
  { path: "letter/:letter", loadChildren: "./letter-detail/letter-detail.module#LetterDetailModule", canActivate: [AuthGuardService] },
  { path: "letter/:letter/artist/:artist", loadChildren: "./artist-detail/artist-detail.module#ArtistDetailModule", canActivate: [AuthGuardService] },
  { path: "letter/:letter/artist/:artist/album/:album", loadChildren: "./album-detail/album-detail.module#AlbumDetailModule", canActivate: [AuthGuardService] },
  { path: "", loadChildren: "./home/home.module#HomeModule", canActivate: [AuthGuardService] }
];

export const appRoutingProviders: any[] = [AuthGuardService, LoginService];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
