import { Injectable } from "@angular/core";
import { Http, Response, RequestOptionsArgs, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import * as _ from 'lodash';

const NOIMAGE = 'global/images/no-cover.png';

@Injectable()
export class BackgroundArtService {

  constructor(private http: Http) { }

  getMediaArt(media: any): Observable<any[]> {
    let urlSearchParams:URLSearchParams = new URLSearchParams();
    urlSearchParams.set('limit', '1');
    let mediaartUrl = '';
    if (media.artist) {
      urlSearchParams.set('q', `album:${media.name}+artist:${media.artist.name}`);
      urlSearchParams.set('type', 'album');
    } else {
      urlSearchParams.set('q', `${media.name}`);
      urlSearchParams.set('type', 'artist');
    }
    let query:RequestOptionsArgs = {
      search: urlSearchParams
    };

    return this.http.get('//api.spotify.com/v1/search', query)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getMediaArtFromLastFm(media:any): Observable<any> {
    let urlSearchParams:URLSearchParams = new URLSearchParams();
    urlSearchParams.set('method', 'artist.getinfo');
    urlSearchParams.set('api_key', '956c1818ded606576d6941de5ff793a5');
    urlSearchParams.set('artist', media.name);
    urlSearchParams.set('format', 'json');
    urlSearchParams.set('autoCorrect', 'true');

    if (media.artist) {
      urlSearchParams.set('method', 'album.getinfo');
      urlSearchParams.set('artist', media.artist.name);
      urlSearchParams.set('album', media.name);
    }
    let query:RequestOptionsArgs = {
      search: urlSearchParams
    };

    return this.http.get('//ws.audioscrobbler.com/2.0/', query)
      .map(this.extractLastFM)
      .catch(this.handleError);
  }

  private extractData(res: Response): string {
    let json = res.json();
    if (json && json.albums && json.albums.items && json.albums.items.length > 0 && json.albums.items[0].images[0]) {
      return (json.albums.items[0].images[0].url || NOIMAGE);
    } else if (json && json.artists && json.artists.items && json.artists.items.length > 0 && json.artists.items[0].images[0]) {
      return (json.artists.items[0].images[0].url || NOIMAGE);
    }
    return NOIMAGE;
  }
  private extractLastFM(res: Response): string {
    let json = res.json();
    let image = NOIMAGE;
    if (json && json.album) {
      _.each(json.album.image, function (e) {
        if (e.size === "mega") {
          image = e["#text"];
        }
      });
    } else if (json && json.artist) {
      _.each(json.artist.image, function (e) {
        if (e.size === "mega") {
          image = e["#text"];
        }
      });
    }
    return image;
  }

  private handleError(error: any) {
    let errorMessage = (error.message) ? error.message : (error.status) ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errorMessage);
  }
}