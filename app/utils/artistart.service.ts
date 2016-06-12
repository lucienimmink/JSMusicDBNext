import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

const NOIMAGE = 'global/images/no-cover.png';

@Injectable()
export class ArtistArtService {
    
  constructor (private http: Http) {}
  
  private artistartUrl = 'https://api.spotify.com/v1/search?q={0}&type=artist&limit=1';

  getArtistArt(artist:string): Observable<any[]> {
    return this.http.get(this.artistartUrl.replace('{0}', artist))
      .map(this.extractData)
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

  private handleError(error: any) {
    let errorMessage = (error.message) ? error.message : (error.status) ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errorMessage);
  }
}