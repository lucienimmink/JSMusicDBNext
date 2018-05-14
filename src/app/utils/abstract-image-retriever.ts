import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface AbstractImageRetriever {
  NOIMAGE: "global/images/no-cover.png";
  getMediaArt(artist: string, album: string, type: string): Observable<any[]>;
}
