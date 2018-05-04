import { Injectable } from "@angular/core";
import {
  Http,
  Response,
  RequestOptionsArgs,
  URLSearchParams
} from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";

import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class RecentlyListenedService {
  constructor(private http: Http) {}

  getRecentlyListened(user: string): Observable<any[]> {
    const urlSearchParams: URLSearchParams = new URLSearchParams();
    urlSearchParams.set("user", user);
    urlSearchParams.set("method", "user.getrecenttracks");
    urlSearchParams.set("api_key", "956c1818ded606576d6941de5ff793a5");
    urlSearchParams.set("format", "json");
    urlSearchParams.set("limit", "6");

    const query: RequestOptionsArgs = {
      search: urlSearchParams
    };

    return this.http
      .get("https://ws.audioscrobbler.com/2.0/", query)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response): any {
    const json: any = res.json();
    if (json.recenttracks) {
      return json.recenttracks.track;
    }
    return null;
  }

  private handleError(error: any): ErrorObservable<any> {
    // tslint:disable-next-line:max-line-length
    const errorMessage: string = error.message
      ? error.message
      : error.status
        ? `${error.status} - ${error.statusText}`
        : "Server error";
    return Observable.throw(errorMessage);
  }
}
