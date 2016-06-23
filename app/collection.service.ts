import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CollectionService {
  constructor(private http: Http) { }

  private collectionUrl = 'http://localhost:2000/data/allTracks.json';

  getCollection(): Observable<any[]> {
    return this.http.get(this.collectionUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }
  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: any) {
    let errorMessage = (error.message) ? error.message : (error.status) ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errorMessage);
  }
}