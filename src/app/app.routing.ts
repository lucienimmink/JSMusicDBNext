import { ModuleWithProviders } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { LoginService } from "./login/login.service";
import { AuthGuardService } from "./utils/authguard.service";

const appRoutes: Routes = [
  { path: "login", loadChildren: () => import("./login/login.module").then(m => m.LoginModule) },
  { path: "home", loadChildren: () => import("./home/home.module").then(m => m.HomeModule), canActivate: [AuthGuardService] },
  { path: "letters", loadChildren: () => import("./letters/letters.module").then(m => m.LettersModule), canActivate: [AuthGuardService] },
  { path: "artists", loadChildren: () => import("./artists/artists.module").then(m => m.ArtistsModule), canActivate: [AuthGuardService] },
  { path: "albums", loadChildren: () => import("./albums/albums.module").then(m => m.AlbumsModule), canActivate: [AuthGuardService] },
  { path: "years", loadChildren: () => import("./years/years.module").then(m => m.YearsModule), canActivate: [AuthGuardService] },
  { path: "playlists", loadChildren: () => import("./playlists/playlists.module").then(m => m.PlaylistsModule), canActivate: [AuthGuardService] },
  { path: "now-playing", loadChildren: () => import("./now-playing/now-playing.module").then(m => m.NowPlayingModule), canActivate: [AuthGuardService] },
  { path: "settings", loadChildren: () => import("./settings/settings.module").then(m => m.SettingsModule), canActivate: [AuthGuardService] },
  {
    path: "scrobble-cache",
    loadChildren: () => import("./scrobble-cache/scrobble-cache.module").then(m => m.ScrobbleCacheModule),
    canActivate: [AuthGuardService],
  },
  { path: "search/:query", loadChildren: () => import("./search/search.module").then(m => m.SearchModule), canActivate: [AuthGuardService] },
  {
    path: "letter/:letter",
    loadChildren: () => import("./letter-detail/letter-detail.module").then(m => m.LetterDetailModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "letter/:letter/artist/:artist",
    loadChildren: () => import("./artist-detail/artist-detail.module").then(m => m.ArtistDetailModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "letter/:letter/artist/:artist/album/:album",
    loadChildren: () => import("./album-detail/album-detail.module").then(m => m.AlbumDetailModule),
    canActivate: [AuthGuardService],
  },
  { path: "", loadChildren: () => import("./home/home.module").then(m => m.HomeModule), canActivate: [AuthGuardService] },
];

export const appRoutingProviders: any[] = [AuthGuardService, LoginService];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules });
