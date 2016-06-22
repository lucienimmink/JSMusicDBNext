import { Injectable } from "@angular/core";
import { Http, Response, URLSearchParams, RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs/Observable";
import * as _ from 'lodash';

@Injectable()
export class LastFMService {

  constructor (private http: Http) {}

  getLovedTracks(user:string): Observable<any> {
    let urlSearchParams:URLSearchParams = new URLSearchParams();
    urlSearchParams.set('api_key', '956c1818ded606576d6941de5ff793a5');
    urlSearchParams.set('format', 'json');
    urlSearchParams.set('limit', '1000');
    urlSearchParams.set('method', 'user.getlovedtracks');
    urlSearchParams.set('user', user);

    let query:RequestOptionsArgs = {
      search: urlSearchParams
    };

    return this.http.get('//ws.audioscrobbler.com/2.0/', query)
      .map(this.extractLastFMLoved)
      .catch(this.handleError);
  }
  getTopArtists(user:string): Observable<any> {
    let urlSearchParams:URLSearchParams = new URLSearchParams();
    urlSearchParams.set('api_key', '956c1818ded606576d6941de5ff793a5');
    urlSearchParams.set('format', 'json');
    urlSearchParams.set('limit', '50');
    urlSearchParams.set('method', 'user.gettopartists');
    urlSearchParams.set('period', '1month');
    urlSearchParams.set('user', user);

    let query:RequestOptionsArgs = {
      search: urlSearchParams
    };

    return this.http.get('//ws.audioscrobbler.com/2.0/', query)
      .map(this.extractLastFMTop)
      .catch(this.handleError);
  }

  private extractLastFMLoved(res: Response):Array<any> {
    let json = res.json();
    if (json.lovedtracks) {
      return json.lovedtracks.track;
    } else {
      return [];
    }
  }

  private extractLastFMTop(res: Response):Array<any> {
    let json = res.json();

    if (json.topartists) {
      return json.topartists.artist;
    } else {
      return [];
    }
  }

  private handleError(error: any) {
    return Observable.throw(null);
  }
}