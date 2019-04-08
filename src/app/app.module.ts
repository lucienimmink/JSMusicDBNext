import { HttpClientModule } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule, EVENT_MANAGER_PLUGINS } from "@angular/platform-browser";
import { ModalModule, TooltipModule } from "ngx-bootstrap";

import { environment } from "../environments/environment";

import { AlbumDetailComponent } from "./album/album-detail/album-detail.component";
import { AlbumComponent } from "./album/album/album.component";
import { AlbumsComponent } from "./album/albums/albums.component";
import { AppComponent } from "./app.component";
import { appRoutingProviders, routing } from "./app.routing";
import { ArtistDetailComponent } from "./artist/artist-detail/artist-detail.component";
import { ArtistComponent } from "./artist/artist/artist.component";
import { ArtistsComponent } from "./artist/artists/artists.component";
import { HomeComponent } from "./home/home.component";
import { LetterDetailComponent } from "./letter/letter-detail/letter-detail.component";
import { LetterComponent } from "./letter/letter/letter.component";
import { LettersComponent } from "./letter/letters/letters.component";
import { LoginComponent } from "./login/login.component";
import { NowPlayingComponent } from "./now-playing/now-playing/now-playing.component";
import { PlayerComponent } from "./player/player/player.component";
import { PlaylistComponent } from "./playlist/playlist/playlist.component";
import { ScrobbleCacheComponent } from "./scrobble-cache/scrobble-cache/scrobble-cache.component";
import { SearchComponent } from "./search/search/search.component";
import { SettingsComponent } from "./settings/settings/settings.component";
import { TopmenuComponent } from "./topmenu/topmenu.component";
import { TrackComponent } from "./track/track/track.component";
import { AlbumArtComponent } from "./utils/album-art/album-art.component";
import { BackgroundArtDirective } from "./utils/background-art.directive";
import { MediaEvents } from "./utils/media-events";
import { SortComponent } from "./utils/sort/sort.component";
import { TimeFormatPipe } from "./utils/time-format.pipe";
import { VsForDirective } from "./utils/vs-for.directive";
import { YearComponent } from "./year/year/year.component";

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
    TooltipModule.forRoot()
    // , ModalModule.forRoot()
  ],
  providers: [appRoutingProviders, { provide: EVENT_MANAGER_PLUGINS, useClass: MediaEvents, multi: true }, { provide: LOCALE_ID, useValue: "en-GB" }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("sw.js")
        .then(reg => {
          // registration worked
          // console.info('Registration succeeded. Scope is ' + reg.scope);
        })
        .catch(error => {
          // registration failed
          console.error("Registration failed with " + error);
        });
    }
  }
}
