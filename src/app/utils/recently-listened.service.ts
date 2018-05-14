import { throwError as observableThrowError, Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class RecentlyListenedService {
  constructor(private http: HttpClient) {}

  getRecentlyListened(user: string) {
    const options = {
      params: {
        user: user,
        method: "user.getrecenttracks",
        api_key: "956c1818ded606576d6941de5ff793a5",
        format: "json",
        limit: "6"
      }
    };
    return this.http
      .get("https://ws.audioscrobbler.com/2.0/", options)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<any> {
    const errorMessage: string = error.message
      ? error.message
      : error.status
        ? `${error.status} - ${error.statusText}`
        : "Server error";
    return observableThrowError(errorMessage);
  }
}
