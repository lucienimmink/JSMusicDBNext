import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CollectionService {
  private dsm: string;

  constructor(private http: Http) {
    this.dsm = localStorage.getItem('dsm');
  }

  private collectionUrl = '/data/node-music.json';
  private reloadUrl = '/rescan';
  private pollUrl = '/progress';

  getCollection(): Observable<any[]> {
    this.dsm = localStorage.getItem('dsm');
    let url = this.dsm + this.collectionUrl;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
  reload(): Observable<any> {
    let url = this.dsm + this.reloadUrl;
    let jwt = localStorage.getItem("jwt");
    return this.http.get(`${url}?_ts=${new Date().getTime()}&jwt=${jwt}`)
      .map(this.noop)
      .catch(this.handleError)
  }
  poll(): Observable<any> {
    let url = this.dsm + this.pollUrl;
    let jwt = localStorage.getItem("jwt");
    return this.http.get(`${url}?_ts=${new Date().getTime()}&jwt=${jwt}`)
      .debounceTime(300)
      .map(this.extractData)
      .catch(this.handleError)
  }
  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  private noop(res: Response) {
    return true;
  }

  private handleError(error: any) {
    let errorMessage = (error.message) ? error.message : (error.status) ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errorMessage);
  }
}