import {
  BrowserModule,
  EVENT_MANAGER_PLUGINS
} from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { YoutubePlayerModule } from "ngx-youtube-player";
import { TooltipModule, ModalModule } from "ngx-bootstrap";

import { environment } from "../environments/environment";

import { routing, appRoutingProviders } from "./app.routing";
import { AppComponent } from "./app.component";
import { AlbumComponent } from "./album/album/album.component";
import { BackgroundArtDirective } from "./utils/background-art.directive";
import { AlbumDetailComponent } from "./album/album-detail/album-detail.component";
import { AlbumArtComponent } from "./utils/album-art/album-art.component";
import { TimeFormatPipe } from "./utils/time-format.pipe";
import { AlbumsComponent } from "./album/albums/albums.component";
import { VsForDirective } from "./utils/vs-for.directive";
import { ArtistComponent } from "./artist/artist/artist.component";
import { ArtistDetailComponent } from "./artist/artist-detail/artist-detail.component";
import { ArtistsComponent } from "./artist/artists/artists.component";
import { SortComponent } from "./utils/sort/sort.component";
import { HomeComponent } from "./home/home.component";
import { TopmenuComponent } from "./topmenu/topmenu.component";
import { MediaEvents } from "./utils/media-events";
import { LoginComponent } from "./login/login.component";
import { LetterComponent } from "./letter/letter/letter.component";
import { LetterDetailComponent } from "./letter/letter-detail/letter-detail.component";
import { LettersComponent } from "./letter/letters/letters.component";
import { YearComponent } from "./year/year/year.component";
import { TrackComponent } from "./track/track/track.component";
import { PlaylistComponent } from "./playlist/playlist/playlist.component";
import { ScrobbleCacheComponent } from "./scrobble-cache/scrobble-cache/scrobble-cache.component";
import { SettingsComponent } from "./settings/settings/settings.component";
import { SearchComponent } from "./search/search/search.component";
import { NowPlayingComponent } from "./now-playing/now-playing/now-playing.component";
import { PlayerComponent } from "./player/player/player.component";

@NgModule({
  declarations: [
    AppComponent,
    AlbumComponent,
    BackgroundArtDirective,
    AlbumDetailComponent,
    AlbumArtComponent,
    TimeFormatPipe,
    AlbumsComponent,
    VsForDirective,
    ArtistComponent,
    ArtistDetailComponent,
    ArtistsComponent,
    SortComponent,
    HomeComponent,
    TopmenuComponent,
    LoginComponent,
    LetterComponent,
    LetterDetailComponent,
    LettersComponent,
    YearComponent,
    TrackComponent,
    PlaylistComponent,
    ScrobbleCacheComponent,
    SettingsComponent,
    SearchComponent,
    NowPlayingComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    routing,
    YoutubePlayerModule,
    TooltipModule.forRoot()
    // , ModalModule.forRoot()
  ],
  providers: [
    appRoutingProviders,
    { provide: EVENT_MANAGER_PLUGINS, useClass: MediaEvents, multi: true },
    { provide: LOCALE_ID, useValue: "en-GB" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("sw.js")
        .then(function(reg) {
          // registration worked
          // console.log('Registration succeeded. Scope is ' + reg.scope);
        })
        .catch(function(error) {
          // registration failed
          console.log("Registration failed with " + error);
        });
    }
  }
}
