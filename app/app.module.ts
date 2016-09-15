import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";

import { routing, appRoutingProviders }  from './app.routing';
import { HttpModule } from '@angular/http';

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

import { LetterComponent } from './letter/letter.component';
import { TopMenuComponent } from './menu/topmenu.component';
import { PlayerComponent } from './player/player.component';

import { AlbumComponent } from './album/album.component';
import { ArtistComponent } from './artist/artist.component';
import { VsFor } from './utils/ng2-vs-for';
import { AlbumArt } from './utils/albumart.component';
import { BackgroundArtDirective } from './utils/backgroundart.directive';
import { TimeFormatPipe } from './timeformat.pipe';
import { TrackListComponent } from './track/tracklist.component';

@NgModule({
    declarations: [AppComponent, 
        LoginComponent, 
        HomeComponent, 
        LettersComponent, 
        LetterDetailComponent, 
        ArtistsComponent, 
        ArtistDetailComponent, 
        AlbumsComponent, 
        AlbumDetailComponent, 
        PlaylistsComponent,
        NowPlayingComponent,
        SettingsComponent,
        ScrobbleCacheComponent,
        SearchComponent, 
        TopMenuComponent, 
        LetterComponent, 
        PlayerComponent,
        AlbumComponent,
        ArtistComponent,
        VsFor,
        AlbumArt,
        TimeFormatPipe,
        TrackListComponent,
        BackgroundArtDirective
    ],
    imports: [BrowserModule, routing, HttpModule],
    providers: [
        appRoutingProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(function (reg) {
                    // registration worked
                    // console.log('Registration succeeded. Scope is ' + reg.scope);
                }).catch(function (error) {
                    // registration failed
                    console.log('Registration failed with ' + error);
                });
        }
    }
}