import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { LastfmImageRetriever } from './art/lastfm-image-retriever';

@Injectable()
export class BackgroundArtService {
  private lastFMImageRetriever: LastfmImageRetriever;
  constructor(private http: Http) {
    this.lastFMImageRetriever = new LastfmImageRetriever(http);
  }
  private extractInfo(media: any): any {
    let artist = '';
    let album = '';
    let type = 'artist';
    if (media.trackArtist && media.album.artist.isCollection) {
      artist = media.trackArtist;
    } else if (media.artist) {
      artist = media.artist.albumArtist || media.artist.name;
      album = media.name || media.album.name;
      type = 'album';
    } else {
      artist = media.albumArtist || media.name;
    }
    return {
      artist,
      album,
      type
    };
  }

  getMediaArt(media: any): Observable<any[]> {
    const info = this.extractInfo(media);
    return this.lastFMImageRetriever.getMediaArt(info.artist, info.album, info.type);
  }

  getMediaArtFromLastFm(media: any): Observable<any> {
    const info = this.extractInfo(media);
    return this.lastFMImageRetriever.getMediaArt(info.artist, info.album, info.type);
  }
}
