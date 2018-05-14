import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { LastfmImageRetriever } from "./art/lastfm-image-retriever";

@Injectable()
export class AlbumArtService {
  private lastfmImageRetriever: LastfmImageRetriever;
  constructor(private http: HttpClient) {
    this.lastfmImageRetriever = new LastfmImageRetriever(http);
  }
  getAlbumArt(artist: string, album: string, type: string): Observable<any[]> {
    // return this.spotifyImageRetriever.getMediaArt(artist, album, type);
    return this.lastfmImageRetriever.getMediaArt(artist, album, type);
  }

  getMediaArtFromLastFm(
    artist: string,
    album: string,
    type: string
  ): Observable<any> {
    return this.lastfmImageRetriever.getMediaArt(artist, album, type);
  }
  returnImageUrlFromLastFMResponse(response: any): string {
    if (response.album) {
      return response.album.image[response.album.image.length - 1]["#text"];
    }
    if (response.artist) {
      return response.artist.image[response.artist.image.length - 1]["#text"];
    }
    return response;
  }
}
