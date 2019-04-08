import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { LastfmImageRetriever } from "./art/lastfm-image-retriever";

@Injectable()
export class AlbumArtService {
  private lastfmImageRetriever: LastfmImageRetriever;
  constructor(private http: HttpClient) {
    this.lastfmImageRetriever = new LastfmImageRetriever(http);
  }
  public getAlbumArt(artist: string, album: string, type: string): Observable<any[]> {
    // return this.spotifyImageRetriever.getMediaArt(artist, album, type);
    return this.lastfmImageRetriever.getMediaArt(artist, album, type);
  }

  public getMediaArtFromLastFm(
    artist: string,
    album: string,
    type: string
  ): Observable<any> {
    return this.lastfmImageRetriever.getMediaArt(artist, album, type);
  }
  public returnImageUrlFromLastFMResponse(response: any): string {
    if (response.album) {
      return response.album.image[response.album.image.length - 1]["#text"];
    }
    if (response.artist) {
      return response.artist.image[response.artist.image.length - 1]["#text"];
    }
    return response;
  }
}
