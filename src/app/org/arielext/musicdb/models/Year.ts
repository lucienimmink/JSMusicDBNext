import Album from "./Album";

export default class Year {
  public year: number;
  public albums: Album[] = [];

  constructor(album: Album) {
    if (album.year) {
      this.year = this.sanitize(album.year);
    }
  }
  private sanitize = (year: any): number => {
    let yearInt = parseInt(year, 10);
    if (isNaN(yearInt)) {
      yearInt = 0;
    }
    return yearInt;
  };
}
