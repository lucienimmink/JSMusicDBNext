import { Injectable } from "@angular/core";
import { Http, Response, RequestOptionsArgs, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import * as _ from 'lodash';

const NOIMAGE = 'global/images/no-cover.png';

@Injectable()
export class BackgroundArtService {

  private albumartUrl = 'https://api.spotify.com/v1/search?q=album:{1}+artist:{0}&type=album&limit=1';
  private artistartUrl = 'https://api.spotify.com/v1/search?q=artist:{0}&type=artist&limit=1';

  constructor(private http: Http) { }

  getMediaArt(media: any): Observable<any[]> {
    let url = '';
    let cachekey: string = '';
    if (media.trackArtist && media.album.artist.isCollection) {
      // show artist art for a track in a collection
      url = this.artistartUrl.replace('{0}', encodeURIComponent(media.trackArtist));
      cachekey = media.trackArtist;
    } else if (media.artist) {
      // this is a track ór an album
      url = this.albumartUrl.replace('{1}', encodeURIComponent(media.name || media.album.name)).replace('{0}', encodeURIComponent(media.artist.albumArtist || media.artist.name));
      cachekey = (media.artist.albumArtist || media.artist.name) + '-' + (media.name || media.album.name);
    } else {
      // this is an artist
      url = this.artistartUrl.replace('{0}', encodeURIComponent(media.albumArtist || media.name));
      cachekey = (media.albumArtist || media.name);
    }

    if (localStorage.getItem(`art-${cachekey}`)) {
      return new Observable(imageObserver => {
        imageObserver.next(localStorage.getItem(`art-${cachekey}`));
        imageObserver.complete();
      });
    } else {

      return this.http.get(url)
        .map(this.extractData)
        .catch(this.handleError);
    }
  }

  getMediaArtFromLastFm(media: any): Observable<any> {
    let urlSearchParams: URLSearchParams = new URLSearchParams();
    urlSearchParams.set('method', 'artist.getinfo');
    urlSearchParams.set('api_key', '956c1818ded606576d6941de5ff793a5');
    urlSearchParams.set('artist', media.trackArtist || media.albumArtist || media.name);
    urlSearchParams.set('format', 'json');
    urlSearchParams.set('autoCorrect', 'true');

    if (media.artist && ((media.trackArtist) ? !media.album.artist.isCollection : true)) {
      // track/album
      urlSearchParams.set('method', 'album.getinfo');
      urlSearchParams.set('artist', (media.trackArtist) ? media.trackArtist : (media.artist.albumArtist || media.artist.name));
      urlSearchParams.set('album', media.name || media.album.name);
    }
    let query: RequestOptionsArgs = {
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
    return image || NOIMAGE;
  }

  private handleError(error: any) {
    return Observable.throw(NOIMAGE);
  }
}