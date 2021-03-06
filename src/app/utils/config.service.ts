import { Observable, Subject, throwError as observableThrowError } from "rxjs";

// import { Http, Response } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class ConfigService {
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
      this.counter = setInterval(() => {
        this.checkTheme();
      }, this.COUNTERTIMER);
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
  public geoSource = new Subject<any>();
  public themeSource = new Subject<any>();
  public modeSource = new Subject<any>();
  public theme$ = this.themeSource.asObservable();
  public mode$ = this.modeSource.asObservable();
  public geo$ = this.geoSource.asObservable();

  public startDate: Date;
  public stopDate: Date;
  private _theme: string = localStorage.getItem("theme") || "light";
  private _mode = "light";
  private counter: any = 0;
  private COUNTERTIMER: number = 60 * 1000;

  constructor(private http: HttpClient) {}

  public getSunriseInfo(lat: number = 51, lng: number = 5): Observable<any> {
    return (
      this.http
        // would like to get the lat/lng from the browser but don't want to bother the user
        .get(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`)
        .pipe(catchError(this.handleError))
    );
  }
  public applyTheme() {
    if (this._theme === "auto") {
      if (!this.counter) {
        this.counter = setInterval(() => {
          this.checkTheme();
        }, this.COUNTERTIMER);
      }
      this.checkTheme(true);
    } else {
      this.setStyleSheet(this._theme);
    }
  }
  public checkTheme(firstRun: boolean = false) {
    const d: Date = new Date();
    if (d < this.stopDate && d > this.startDate && this._mode !== "dark") {
      this._mode = "dark";
      this.setStyleSheet(this._mode);
    } else if ((d > this.stopDate || d < this.startDate) && this._mode !== "light") {
      this._mode = "light";
      this.setStyleSheet(this._mode);
    }
    if (firstRun) {
      this.setStyleSheet(this._mode);
    }
  }
  private handleError(error: any) {
    return observableThrowError(null);
  }

  private setStyleSheet(style: string) {
    const stylesheet = document.createElement("link");
    stylesheet.setAttribute("rel", "stylesheet");
    stylesheet.setAttribute("type", "text/css");
    // @ts-ignore
    stylesheet.setAttribute("href", window.ENV === "prod" || !window.ENV ? `global/css/${style}.css` : `/dist/sass/${style}.css`);
    stylesheet.setAttribute("id", "customStylesheet");

    const current = document.getElementById("customStylesheet");
    if (current) {
      document.getElementsByTagName("head")[0].removeChild(current);
    }
    document.getElementsByTagName("head")[0].appendChild(stylesheet);
    localStorage.setItem("theme", this._theme);
    localStorage.setItem("style", style);
    this.themeSource.next(this._theme);
    this.modeSource.next(style);
  }
}
