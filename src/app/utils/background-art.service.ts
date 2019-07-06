// import { Http, Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { LastfmImageRetriever } from "./art/lastfm-image-retriever";

@Injectable()
export class BackgroundArtService {
  private lastFMImageRetriever: LastfmImageRetriever;
  private API_KEY: string = "639fca5adcf955a19f9a04f8985e9ded";
  constructor(private http: HttpClient) {
    this.lastFMImageRetriever = new LastfmImageRetriever(http);
  }

  public getMediaArt(media: any): Observable<any[]> {
    const info = this.extractInfo(media);
    return this.lastFMImageRetriever.getMediaArt(
      info.artist,
      info.album,
      info.type
    );
  }

  public getMediaArtFromLastFm(media: any): Observable<any> {
    const info = this.extractInfo(media);
    return this.lastFMImageRetriever.getMediaArt(
      info.artist,
      info.album,
      info.type
    );
  }
  public async returnImageUrlFromLastFMResponse(response: any) {
    if (response.album) {
      return response.album.image[response.album.image.length - 1]["#text"];
    }
    if (response.artist) {
      // we need to fetch the image from fanart.tv for now
      // use the mbid from the response
      const mbid = response.artist.mbid;
      if (mbid) {
        return this.getArtistURLArtFormFanart(mbid, response.artist);
      }
      return response.artist.image[response.artist.image.length - 1]["#text"];
    }
    return response;
  }
  private async getArtistURLArtFormFanart(mbid: string, artist: any) {
    const response = await fetch(
      `https://webservice.fanart.tv/v3/music/${mbid}&?api_key=${
        this.API_KEY
      }&format=json`
    );
    if (response.status === 200) {
      const json = await response.json();
      if (json.artistbackground) {
        return json.artistbackground[0].url;
      }
    }
    return this.getArtistURLArtFromAudioDB(artist);
  }
  private async getArtistURLArtFromAudioDB(artist: any) {
    const audiodbresponse = await fetch(
      `https://www.theaudiodb.com/api/v1/json/1/search.php?s=${encodeURIComponent(
        artist.name
      )}`
    );
    if (audiodbresponse.status === 200) {
      const audiodbjson = await audiodbresponse.json();
      if (audiodbjson && audiodbjson.artists) {
        return audiodbjson.artists[0].strArtistFanart;
      }
    }
    return artist.image[artist.image.length - 1]["#text"];
  }
  private extractInfo(media: any): any {
    let artist = "";
    let album = "";
    let type = "artist";
    if (media.trackArtist && media.album.artist.isCollection) {
      artist = media.trackArtist;
    } else if (media.artist) {
      artist = media.artist.albumArtist || media.artist.name;
      album = media.name || media.album.name;
      type = "album";
    } else {
      artist = media.albumArtist || media.name;
    }
    return {
      artist,
      album,
      type
    };
  }
}
