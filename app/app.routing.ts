import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LettersComponent } from './letter/letters.component';
import { ArtistsComponent } from './artist/artists.component';
import { AlbumsComponent } from './album/albums.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { NowPlayingComponent } from './nowPlaying/nowPlaying.component';
import { SettingsComponent } from './settings/settings.component';
import { ScrobbleCacheComponent } from './scrobbleCache/scrobbleCache.component';
import { SearchComponent } from './search/search.component';
import { LetterDetailComponent } from './letter/letterdetail.component';
import { ArtistDetailComponent } from './artist/artistdetail.component';
import { AlbumDetailComponent } from './album/albumdetail.component';

const appRoutes: Routes = [
  { path: '/login', component: LoginComponent },
  { path: '/home', component: HomeComponent },
  { path: '/letters', component: LettersComponent },
  { path: '/artists', component: ArtistsComponent },
  { path: '/albums', component: AlbumsComponent },
  { path: '/playlists/:playlist', component: PlaylistsComponent },
  { path: '/nowPlaying', component: NowPlayingComponent },
  { path: '/settings', component: SettingsComponent },
  { path: '/settings/scrobble-cache', component: ScrobbleCacheComponent },
  { path: '/search/:query', component: SearchComponent },
  { path: '/letter/:letter', component: LetterDetailComponent },
  { path: '/letter/:letter/artist/:artist', component: ArtistDetailComponent },
  { path: '/letter/:letter/artist/:artist/album/:album', component: AlbumDetailComponent },
  { path: '', component: HomeComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
