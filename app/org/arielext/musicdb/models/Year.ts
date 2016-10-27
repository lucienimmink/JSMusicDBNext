import Album from "./Album";

export default class Year {

    year: number;
    albums: Array<Album> = [];

    constructor(album: Album) {
        if (album.year) {
            this.year = this.sanitize(album.year);
        }
    }
    private sanitize = function (year: any): number {
        let yearInt = parseInt(year);
        if (isNaN(yearInt)) {
            yearInt = 0;
        }
        return yearInt;
    }
}