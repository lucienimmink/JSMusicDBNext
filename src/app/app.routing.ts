import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LettersComponent } from './letter/letters/letters.component';
import { ArtistsComponent } from './artist/artists/artists.component';
import { AlbumsComponent } from './album/albums/albums.component';
import { YearComponent } from './year/year/year.component';
import { PlaylistComponent } from './playlist/playlist/playlist.component';
import { NowPlayingComponent } from './now-playing/now-playing/now-playing.component';
import { SettingsComponent } from './settings/settings/settings.component';
import { ScrobbleCacheComponent } from './scrobble-cache/scrobble-cache/scrobble-cache.component';
import { SearchComponent } from './search/search/search.component';
import { LetterDetailComponent } from './letter/letter-detail/letter-detail.component';
import { ArtistDetailComponent } from './artist/artist-detail/artist-detail.component';
import { AlbumDetailComponent } from './album/album-detail/album-detail.component';

import { AuthGuardService } from './utils/authguard.service';
import { LoginService } from './login/login.service';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
    { path: 'letters', component: LettersComponent, canActivate: [AuthGuardService] },
    { path: 'artists', component: ArtistsComponent, canActivate: [AuthGuardService] },
    { path: 'albums', component: AlbumsComponent, canActivate: [AuthGuardService] },
    { path: 'years', component: YearComponent, canActivate: [AuthGuardService] },
    { path: 'playlists', component: PlaylistComponent, canActivate: [AuthGuardService] },
    { path: 'now-playing', component: NowPlayingComponent, canActivate: [AuthGuardService] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
    { path: 'scrobble-cache', component: ScrobbleCacheComponent, canActivate: [AuthGuardService] },
    { path: 'search/:query', component: SearchComponent, canActivate: [AuthGuardService] },
    { path: 'letter/:letter', component: LetterDetailComponent, canActivate: [AuthGuardService] },
    { path: 'letter/:letter/artist/:artist', component: ArtistDetailComponent, canActivate: [AuthGuardService] },
    { path: 'letter/:letter/artist/:artist/album/:album', component: AlbumDetailComponent, canActivate: [AuthGuardService] },
    { path: '', component: HomeComponent, canActivate: [AuthGuardService] }
];

export const appRoutingProviders: any[] = [
    AuthGuardService, LoginService
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
