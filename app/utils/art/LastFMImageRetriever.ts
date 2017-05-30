import { AbstractImageRetriever } from './AbstractImageRetriever';
import { Http, Response, RequestOptionsArgs, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";

export class LastFMImageRetriever implements AbstractImageRetriever {
    NOIMAGE: 'global/images/no-cover.png'; // I want this in my interface; but how

    constructor(private http: Http) { }

    getMediaArt(artist: string, album: string, type: string): Observable<any[]> {
        let urlSearchParams: URLSearchParams = new URLSearchParams();
        urlSearchParams.set('api_key', '956c1818ded606576d6941de5ff793a5');
        urlSearchParams.set('artist', artist);
        urlSearchParams.set('format', 'json');
        urlSearchParams.set('autoCorrect', 'true');

        if (type === "album") {
            urlSearchParams.set('method', 'album.getinfo');
            urlSearchParams.set('album', album);
        } else {
            urlSearchParams.set('method', 'artist.getinfo');
        }

        let query: RequestOptionsArgs = {
            search: urlSearchParams
        };

        return this.http.get('https://ws.audioscrobbler.com/2.0/', query)
            .map(this.extractData)
            .catch(this.handleError);
    }

    extractData(res: Response): string {
        let json = res.json();
        let image = this.NOIMAGE;
        if (json && json.album) {
            json.album.image.some((e) => {
                if (e.size === "extralarge") {
                    image = e["#text"];
                }
            });
        } else if (json && json.artist) {
            json.artist.image.some((e) => {
                if (e.size === "extralarge") {
                    image = e["#text"];
                }
            });
        }
        return image || this.NOIMAGE;
    }
    handleError(error: Response) {
        return Observable.throw(this.NOIMAGE);
    }
}