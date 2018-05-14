import { throwError as observableThrowError, Observable } from "rxjs";
import { debounceTime, map, catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";
//import { Http, Response } from '@angular/http';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CollectionService {
  private dsm: string;

  constructor(private http: HttpClient) {
    this.dsm = localStorage.getItem("dsm");
  }

  private collectionUrl = "/data/node-music.json";
  private reloadUrl = "/rescan";
  private pollUrl = "/progress";

  getCollection() {
    this.dsm = localStorage.getItem("dsm");
    const url = this.dsm + this.collectionUrl;
    return this.http.get(url).pipe(catchError(this.handleError));
  }
  reload(): Observable<any> {
    const url = this.dsm + this.reloadUrl;
    const jwt = localStorage.getItem("jwt");
    return this.http
      .get(`${url}?_ts=${new Date().getTime()}&jwt=${jwt}`)
      .pipe(catchError(this.handleError));
  }
  poll(): Observable<any> {
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
