import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { LastfmImageRetriever } from './art/lastfm-image-retriever';

@Injectable()
export class AlbumArtService {
  private lastfmImageRetriever: LastfmImageRetriever;
  constructor(private http: Http) {
    this.lastfmImageRetriever = new LastfmImageRetriever(http);
  }
  getAlbumArt(artist: string, album: string, type: string): Observable<any[]> {
    //return this.spotifyImageRetriever.getMediaArt(artist, album, type);
    return this.lastfmImageRetriever.getMediaArt(artist, album, type);
  }

  getMediaArtFromLastFm(artist: string, album: string, type: string): Observable<any> {
    return this.lastfmImageRetriever.getMediaArt(artist, album, type);
  }
}
