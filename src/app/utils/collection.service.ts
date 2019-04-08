// import { Http, Response } from '@angular/http';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError as observableThrowError } from "rxjs";
import { catchError, debounceTime, map } from "rxjs/operators";

@Injectable()
export class CollectionService {
  private dsm: string;

  private collectionUrl = "/data/node-music.json";
  private reloadUrl = "/rescan";
  private pollUrl = "/progress";

  constructor(private http: HttpClient) {
    this.dsm = localStorage.getItem("dsm");
  }

  public getCollection() {
    this.dsm = localStorage.getItem("dsm");
    const url = this.dsm + this.collectionUrl;
    return this.http.get(url).pipe(catchError(this.handleError));
  }
  public reload(): Observable<any> {
    const url = this.dsm + this.reloadUrl;
    const jwt = localStorage.getItem("jwt");
    return this.http
      .get(`${url}?_ts=${new Date().getTime()}&jwt=${jwt}`)
      .pipe(catchError(this.handleError));
  }
  public poll(): Observable<any> {
    const url = this.dsm + this.pollUrl;
    const jwt = localStorage.getItem("jwt");
    return this.http
      .get(`${url}?_ts=${new Date().getTime()}&jwt=${jwt}`)
      .pipe(debounceTime(300), catchError(this.handleError));
  }
  private handleError(error: any) {
    const errorMessage = error.message
      ? error.message
      : error.status
        ? `${error.status} - ${error.statusText}`
        : "Server error";
    return observableThrowError(errorMessage);
  }
}
