import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule, EVENT_MANAGER_PLUGINS } from "@angular/platform-browser";
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppComponent } from "./app.component";
import { appRoutingProviders, routing } from "./app.routing";
import { LetterComponent } from "./letter/letter/letter.component";
import { PlayerComponent } from "./player/player/player.component";
import { TopmenuComponent } from "./topmenu/topmenu.component";
import { MediaEvents } from "./utils/media-events";
import { SharedModule } from "./utils/shared/shared.module";
import { SortComponent } from "./utils/sort/sort.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, SortComponent, TopmenuComponent, LetterComponent, PlayerComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, routing, TooltipModule.forRoot(), SharedModule, BrowserAnimationsModule],
  providers: [appRoutingProviders, { provide: EVENT_MANAGER_PLUGINS, useClass: MediaEvents, multi: true }, { provide: LOCALE_ID, useValue: "en-GB" }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
