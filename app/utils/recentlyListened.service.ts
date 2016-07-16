import { Injectable } from "@angular/core";
import { Http, Response, RequestOptionsArgs, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class RecentlyListenedService {

    constructor(private http: Http) { }

    getRecentlyListened(user: string): Observable<any[]> {
        let urlSearchParams: URLSearchParams = new URLSearchParams();
        urlSearchParams.set('user', user);
        urlSearchParams.set('method', 'user.getrecenttracks');
        urlSearchParams.set('api_key', '956c1818ded606576d6941de5ff793a5');
        urlSearchParams.set('format', 'json');
        urlSearchParams.set('limit', '9');

        let query: RequestOptionsArgs = {
            search: urlSearchParams
        };

        return this.http.get('//ws.audioscrobbler.com/2.0/', query)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response): any {
        let json = res.json();
        if (json.recenttracks) {
            return json.recenttracks.track;
        }
        return null;
    }

    private handleError(error: any) {
        let errorMessage = (error.message) ? error.message : (error.status) ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errorMessage);
    }
}