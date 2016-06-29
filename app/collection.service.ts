import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CollectionService {
    constructor(private http: Http) { }

    private collectionUrl = '/data/node-music.json';
    private reloadUrl = '/rescan';

    getCollection(): Observable<any[]> {
        let jwt = JSON.parse(localStorage.getItem('jwt'));
        let url = this.collectionUrl;
        if (jwt) {
            url = jwt.dsmport + this.collectionUrl;
        }
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    reload(): Observable<any> {
        let jwt = JSON.parse(localStorage.getItem('jwt'));
        let url = this.reloadUrl;
        if (jwt) {
            url = jwt.dsmport + this.reloadUrl;
        }
        return this.http.get(`${url}?_ts=${new Date().getTime()}`)
            .map(this.noop)
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