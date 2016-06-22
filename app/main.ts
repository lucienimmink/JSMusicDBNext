import { bootstrap }    from '@angular/platform-browser-dynamic';
import { enableProdMode, provide } from '@angular/core';
import { Http, HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { IMAGELAZYLOAD_DIRECTIVE } from './utils/imagelazyloadarea.directive';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import {disableDeprecatedForms, provideForms} from '@angular/forms';

import { AppComponent } from "./app.component";

//enableProdMode();

bootstrap(AppComponent, [HTTP_PROVIDERS, ROUTER_PROVIDERS, IMAGELAZYLOAD_DIRECTIVE, disableDeprecatedForms()
   provideForms(), provide(AuthHttp, {
  useFactory: (http) => {
    return new AuthHttp(new AuthConfig({
      tokenName: 'jwt'
    }), http);
  },
  deps: [Http]
})]);