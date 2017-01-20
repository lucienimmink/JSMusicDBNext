import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

export interface AbstractImageRetriever {
    NOIMAGE: 'global/images/no-cover.png';
    getMediaArt(artist: string, album: string, type: string): Observable<any[]>
    extractData(res: Response): string
    handleError(error: Response)
}