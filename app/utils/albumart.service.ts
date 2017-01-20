import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { LastFMImageRetriever } from './art/LastFMImageRetriever';
import { SpotifyImageRetriever } from './art/SpotifyImageRetriever';

@Injectable()
export class AlbumArtService {

  private lastFMImageRetriever: LastFMImageRetriever;
  private spotifyImageRetriever: SpotifyImageRetriever;

  constructor(http: Http) {
    this.lastFMImageRetriever = new LastFMImageRetriever(http);
    this.spotifyImageRetriever = new SpotifyImageRetriever(http);
  }

  getAlbumArt(artist: string, album: string, type: string): Observable<any[]> {
    //return this.spotifyImageRetriever.getAlbumArt(artist, album, type);
    return this.lastFMImageRetriever.getMediaArt(artist, album, type);
  }

  getMediaArtFromLastFm(artist: string, album: string, type: string): Observable<any> {
    return this.lastFMImageRetriever.getMediaArt(artist, album, type);
  }
}