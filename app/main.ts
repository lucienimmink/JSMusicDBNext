import { bootstrap }    from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { IMAGELAZYLOAD_DIRECTIVE } from './utils/imagelazyloadarea.directive';

import { AppComponent } from "./app.component";

//enableProdMode();

bootstrap(AppComponent, [ HTTP_PROVIDERS, ROUTER_PROVIDERS, IMAGELAZYLOAD_DIRECTIVE ]);