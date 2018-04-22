import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ConfigService {
  private _theme: string = localStorage.getItem("theme") || "light";
  private _mode = "light";
  private themeSource = new Subject<any>();
  private modeSource = new Subject<any>();
  private counter: any = 0;
  private COUNTERTIMER: number = 60 * 1000;
  theme$ = this.themeSource.asObservable();
  mode$ = this.modeSource.asObservable();
  public startHour: number;
  public stopHour: number;

  constructor(private http: Http) {}
  public getSunriseInfo(): Observable<any> {
    return (
      this.http
        // would like to get the lat/lng from the browser but don't want to bother the user
        .get("//api.sunrise-sunset.org/json?lat=51&lng=5&formatted=0")
        .map(this.getSunriseSunset)
        .catch(this.handleError)
    );
  }
  private handleError(error: any) {
    return Observable.throw(null);
  }

  private getSunriseSunset(res: Response): void {
    const body = res.json();
    return body;
  }

  private setStyleSheet(style: string) {
    const stylesheet = document.createElement("link");
    stylesheet.setAttribute("rel", "stylesheet");
    stylesheet.setAttribute("type", "text/css");
    stylesheet.setAttribute(
      "href",
      window["ENV"] === "prod" || !window["ENV"]
        ? `global/css/${style}.css`
        : `/dist/sass/${style}.css`
    );
    stylesheet.setAttribute("id", "customStylesheet");

    const current = document.getElementById("customStylesheet");
    if (current) {
      document.getElementsByTagName("head")[0].removeChild(current);
    }
    document.getElementsByTagName("head")[0].appendChild(stylesheet);
    localStorage.setItem("theme", this._theme);
    this.themeSource.next(this._theme);
    this.modeSource.next(style);
  }

  get startTime(): string {
    return `${this.startHour}:00`;
  }

  get stopTime(): string {
    return `${this.stopHour}:00`;
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
  applyTheme() {
    if (this._theme === "auto") {
      if (!this.counter) {
        this.counter = setInterval(() => {
          this.checkTheme();
        }, this.COUNTERTIMER);
      }
      this.checkTheme();
    } else {
      this.setStyleSheet(this._theme);
    }
  }
  checkTheme() {
    const d: Date = new Date();
    if (
      d.getHours() < this.stopHour ||
      (d.getHours() > this.startHour && this._mode !== "dark")
    ) {
      this._mode = "dark";
    } else if (this._mode !== "light") {
      this._mode = "light";
    }
    this.setStyleSheet(this._mode);
  }
}
