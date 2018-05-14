import { throwError as observableThrowError, Observable } from "rxjs";

import { catchError, map } from "rxjs/operators";
import { AbstractImageRetriever } from "./../abstract-image-retriever";
import { HttpClient, HttpParams } from "@angular/common/http";
import { UrlEncoder } from "./url-encoder";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

export class LastfmImageRetriever implements AbstractImageRetriever {
  NOIMAGE: "global/images/no-cover.png";

  constructor(private http: HttpClient) {}

  getMediaArt(artist: string, album: string, type: string): Observable<any> {
    let params = new HttpParams()
      .set("api_key", "956c1818ded606576d6941de5ff793a5")
      .set("artist", artist)
      .set("format", "json")
      .set("autoCorrect", "true");
    if (type === "album") {
      params = params.set("method", "album.getinfo");
      params = params.set("album", album);
    } else {
      params = params.set("method", "artist.getinfo");
    }
    const options = {
      params
    };
    return this.http
      .get("https://ws.audioscrobbler.com/2.0/", options)
      .pipe(catchError(this.handleError));
  }

  /*
  extractData(res: Response): string {
    const json = res.json();
    let image = this.NOIMAGE;
    if (json && json.album) {
      json.album.image.some(e => {
        if (e.size === "mega") {
          image = e["#text"];
        }
      });
    } else if (json && json.artist) {
      json.artist.image.some(e => {
        if (e.size === "mega") {
          image = e["#text"];
        }
      });
    }
    return image || this.NOIMAGE;
  }
  */
  handleError(error: Response) {
    return observableThrowError(this.NOIMAGE);
  }
}
