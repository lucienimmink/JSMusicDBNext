import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LettersComponent } from './letter/letters.component';
import { ArtistsComponent } from './artist/artists.component';
import { AlbumsComponent } from './album/albums.component';
import { YearsComponent } from './years/years.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { NowPlayingComponent } from './nowPlaying/nowPlaying.component';
import { SettingsComponent } from './settings/settings.component';
import { ScrobbleCacheComponent } from './scrobbleCache/scrobbleCache.component';
import { SearchComponent } from './search/search.component';
import { LetterDetailComponent } from './letter/letterdetail.component';
import { ArtistDetailComponent } from './artist/artistdetail.component';
import { AlbumDetailComponent } from './album/albumdetail.component';

import { AuthGuard } from './authguard.service';
import { LoginService } from './login/login.service';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'letters', component: LettersComponent, canActivate: [AuthGuard] },
  { path: 'artists', component: ArtistsComponent, canActivate: [AuthGuard] },
  { path: 'albums', component: AlbumsComponent, canActivate: [AuthGuard] },
  { path: 'years', component: YearsComponent, canActivate: [AuthGuard] },
  { path: 'playlists', component: PlaylistsComponent, canActivate: [AuthGuard] },
  { path: 'now-playing', component: NowPlayingComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'scrobble-cache', component: ScrobbleCacheComponent, canActivate: [AuthGuard] },
  { path: 'search/:query', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'letter/:letter', component: LetterDetailComponent, canActivate: [AuthGuard] },
  { path: 'letter/:letter/artist/:artist', component: ArtistDetailComponent, canActivate: [AuthGuard] },
  { path: 'letter/:letter/artist/:artist/album/:album', component: AlbumDetailComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] }
];

export const appRoutingProviders: any[] = [
  AuthGuard, LoginService
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
