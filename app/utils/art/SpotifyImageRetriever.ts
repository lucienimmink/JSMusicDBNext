import { AbstractImageRetriever } from './AbstractImageRetriever';
import { Http, Response, RequestOptionsArgs, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";

export class SpotifyImageRetriever implements AbstractImageRetriever {
    NOIMAGE: 'global/images/no-cover.png'; // I want this in my interface; but how
    private albumartUrl = 'https://api.spotify.com/v1/search?q=album:{1}+artist:{0}&type=album&limit=1';
    private artistartUrl = 'https://api.spotify.com/v1/search?q=artist:{0}&type=artist&limit=1';

    constructor(private http: Http) { }

    getMediaArt(artist: string, album: string, type: string): Observable<any[]> {
        if (type === 'album') {
            return this.http.get(this.albumartUrl.replace('{1}', encodeURIComponent(album)).replace('{0}', encodeURIComponent(artist)))
                .map(this.extractData)
                .catch(this.handleError);
        } else {
            return this.http.get(this.artistartUrl.replace('{0}', encodeURIComponent(artist)))
                .map(this.extractData)
                .catch(this.handleError);
        }
    }

    extractData(res: Response): string {
        let json = res.json();
        if (json && json.albums && json.albums.items && json.albums.items.length > 0 && json.albums.items[0].images[0]) {
            return (json.albums.items[0].images[0].url || this.NOIMAGE);
        } else if (json && json.artists && json.artists.items && json.artists.items.length > 0 && json.artists.items[0].images[0]) {
            return (json.artists.items[0].images[0].url || this.NOIMAGE);
        }
        return this.NOIMAGE;
    }
    handleError(error: Response) {
        return Observable.throw(this.NOIMAGE);
    }
}