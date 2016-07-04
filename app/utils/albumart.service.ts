import { Injectable } from "@angular/core";
import { Http, Response, URLSearchParams, RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs/Observable";
import * as _ from 'lodash';

const NOIMAGE = 'global/images/no-cover.png';

@Injectable()
export class AlbumArtService {

  constructor (private http: Http) {}

  private albumartUrl = 'https://api.spotify.com/v1/search?q=album:{1}+artist:{0}&type=album&limit=1';
  private artistartUrl = 'https://api.spotify.com/v1/search?q=artist:{0}&type=artist&limit=1';

  getAlbumArt(artist:string, album:string, type:string): Observable<any[]> {
    if (type === 'album') {
      return this.http.get(this.albumartUrl.replace('{1}', encodeURIComponent(album)).replace('{0}', encodeURIComponent(artist)))
        .map(this.extractData)
        .catch(this.handleError);
    } else {
      return this.http.get(this.artistartUrl.replace('{0}', encodeURIComponent(artist)))
        .map(this.extractData)
        .catch(this.handleError);
    }
  }

  getMediaArtFromLastFm(artist:string, album:string, type:string): Observable<any> {
    let urlSearchParams:URLSearchParams = new URLSearchParams();
    urlSearchParams.set('api_key', '956c1818ded606576d6941de5ff793a5');
    urlSearchParams.set('artist', artist);
    urlSearchParams.set('format', 'json');
    urlSearchParams.set('autoCorrect', 'true');

    if (type === "album") {
      urlSearchParams.set('method', 'album.getinfo');
      urlSearchParams.set('album', album);
    } else {
      urlSearchParams.set('method', 'artist.getinfo');
    }

    let query:RequestOptionsArgs = {
      search: urlSearchParams
    };

    return this.http.get('//ws.audioscrobbler.com/2.0/', query)
      .map(this.extractLastFM)
      .catch(this.handleError);
  }


  private extractData(res: Response):string {
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
    return image || NOIMAGE;
  }

  private handleError(error: any) {
    return Observable.throw(NOIMAGE);
  }
}