import Artist from "./Artist";

export default class Letter {

  letter: string;
  escapedLetter: string;
  artists: Array<Artist> = [];
  active: boolean = false;

  constructor(json: any) {
    if (json.album && json.title) {
      this.letter = json.letter || this.getFirstLetterOf(json.albumArtist || json.albumartist || json.artist);
      if (this.letter === "1") this.letter = "#";
      this.escapedLetter = encodeURIComponent(this.letter);
    }
  };
  url() {
    return `/letter/${this.escapedLetter}/`;
  };
  private getFirstLetterOf(name: string): string {
    return this.stripFromName(name, 'the ');
  };
  private stripFromName(name: string, strip: string): string {
    var s = strip.toUpperCase();
    var f = (name) ? name.toUpperCase() : '';
    f = f.trim();
    if (f.indexOf(s) === 0) {
      f = f.substring(s.length);
    }
    return this.groupIfSpecialChar(f.substr(0, 1));
  }
  private groupIfSpecialChar(c: string): string {
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '(', ')', '[', ']', '{', '}', '_', '-', '.'].indexOf(c) !== -1) {
      return '#';
    }
    return c;
  }
  sortArtistsBy(sortkey: string = 'sortName', direction: string = 'asc'): void {
    if (sortkey === 'albums') {
      this.artists.sort((a,b) => {
        	if (a.albums.length > b.albums.length) {
            return (direction === 'asc') ? -1 : 1;
          } else if (a.albums.length < b.albums.length) {
            return (direction === 'asc') ? 1 : -1;
          }
          return 0;
      });
    } else {
      this.artists.sort((a, b) => {
        if (sortkey.indexOf('.') !== -1) {
          let sorter = sortkey.split(".");
          if (a[sorter[0]][sorter[1]] < b[sorter[0]][sorter[1]]) {
            return (direction === 'asc') ? -1 : 1;
          } else if (a[sorter[0]][sorter[1]] > b[sorter[0]][sorter[1]]) {
            return (direction === 'asc') ? 1 : -1;
          } else {
            return 0;
          }
        }
        if (a[sortkey].toUpperCase() < b[sortkey].toUpperCase()) {
          return (direction === 'asc') ? -1 : 1;
        } else if (a[sortkey].toUpperCase() > b[sortkey].toUpperCase()) {
          return (direction === 'asc') ? 1 : -1;
        }
        return 0;
      });
    }
  }
  sortAndReturnArtistsBy(sortkey: string = 'name', direction = 'asc'): Array<Artist> {
    this.sortArtistsBy(sortkey, direction);
    return this.artists;
  }
}