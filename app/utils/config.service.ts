import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ConfigService {
    private _theme: string = localStorage.getItem("theme") || 'light';
    private _mode: string = "light";
    private themeSource = new Subject<any>();
    private modeSource = new Subject<any>();
    private counter: any = 0;
    private COUNTERTIMER: number = 60 * 1000;
    theme$ = this.themeSource.asObservable();
    mode$ = this.modeSource.asObservable();

    constructor() { }

    private setStyleSheet(style: string) {
        let stylesheet = document.createElement("link");
        stylesheet.setAttribute('rel', 'stylesheet');
        stylesheet.setAttribute('type', 'text/css');
        stylesheet.setAttribute('href', (window['ENV'] === 'prod' || !window["ENV"]) ? `css/${style}.css` : `/dist/sass/${style}.css`);
        stylesheet.setAttribute('id', 'customStylesheet');

        let current = document.getElementById('customStylesheet');
        if (current) {
            document.getElementsByTagName('head')[0].removeChild(current);
        }
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
        localStorage.setItem('theme', this._theme);
        this.themeSource.next(this._theme);
        this.modeSource.next(style);
    }

    get theme(): string {
        return this._theme;
    }
    get mode(): string {
        return this._mode;
    }
    set theme(theme: string) {
        if (this._theme !== theme) {
            this._theme = theme;
        }
        if (this._theme === "auto" && !this.counter) {
            this.counter = setInterval(() => { this.checkTheme() }, this.COUNTERTIMER);
            this.checkTheme();
        } else if (this._theme === "auto") {
            // timer has already started, we can ignore it all!
        } else {
            this.setStyleSheet(this._theme);
            clearInterval(this.counter);
            this.counter = 0;
            this._mode = this._theme;
        }
    }
    applyTheme() {
        if (this._theme === "auto") {
            if (!this.counter) {
                this.counter = setInterval(() => { this.checkTheme() }, this.COUNTERTIMER);
            }
            this.checkTheme();
        } else {
            this.setStyleSheet(this._theme);
        }
    }
    checkTheme() {
        let d: Date = new Date();
        if (d.getHours() < 7 || d.getHours() > 21 && this._mode !== "dark") {
            this._mode = "dark";
            this.setStyleSheet(this._mode);
        } else if (d.getHours() > 6 && d.getHours() < 22 && this._mode !== "light") {
            this._mode = "light";
            this.setStyleSheet(this._mode);
        }
    }
}