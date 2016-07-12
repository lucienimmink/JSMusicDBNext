import { Injectable } from '@angular/core'
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class ConfigService {
    private _theme:string = localStorage.getItem("theme") || 'light';
    private themeSource = new Subject<any>();
    theme$ = this.themeSource.asObservable();

    constructor() {
        this.setStyleSheet();
    }

    private setStyleSheet() {
        let stylesheet = document.createElement("link");
        stylesheet.setAttribute('rel', 'stylesheet');
        stylesheet.setAttribute('type', 'text/css');
        stylesheet.setAttribute('href', `/dist/sass/${this._theme}.css`);
        stylesheet.setAttribute('id', 'customStylesheet');

        let current = document.getElementById('customStylesheet');
        if (current) {
            document.getElementsByTagName('head')[0].removeChild(current);
        }
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
    }

    get theme():string {
        return this._theme;
    }
    set theme(theme:string) {
        this._theme = theme;
        this.themeSource.next(theme);
        this.setStyleSheet();
    }
}