import { bootstrap }    from '@angular/platform-browser-dynamic';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { enableProdMode, provide } from '@angular/core';
import { Http, HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { disableDeprecatedForms, provideForms} from '@angular/forms';
import { IMAGELAZYLOAD_DIRECTIVE } from './utils/imagelazyloadarea.directive';
import { AuthConfig, AuthHttp } from 'angular2-jwt';

import { MediaEvents } from './utils/MediaEvents';

import { AppComponent } from "./app.component";

if (window['ENV'] && window['ENV'] === "prod") {
  enableProdMode();
}

bootstrap(AppComponent, [HTTP_PROVIDERS, ROUTER_PROVIDERS, IMAGELAZYLOAD_DIRECTIVE, disableDeprecatedForms()
  , provideForms(), provide(AuthHttp, {
    useFactory: (http) => {
      return new AuthHttp(new AuthConfig({
        tokenName: 'jwt'
      }), http);
    },
    deps: [Http]
  }),
  {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: MediaEvents,
    multi: true
  }
]);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}