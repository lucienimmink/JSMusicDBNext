import Artist from "./Artist";
import * as _ from "lodash";

export default class Letter {

  letter: string;
  escapedLetter: string;
  artists: Array<Artist> = [];

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
    var f = name.toUpperCase();
    f = _.trim(f);
    if (_.startsWith(f, s)) {
      f = f.substring(4);
    }
    return this.groupIfSpecialChar(f.substr(0,1));
  }
  private groupIfSpecialChar(c: string): string {
    if (_.indexOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '(', ')', '[', ']', '{', '}', '_', '-', '.'], c) !== -1) {
      return '#';
    }
    return c;
  }
  sortArtistsBy(sortkey: string = 'name', direction: string = 'asc'): void {
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
      } else if (a[sortkey] > b[sortkey]) {
        return (direction === 'asc') ? 1 : -1;
      }
      return 0;
    });
  }
  sortAndReturnArtistsBy(sortkey: string = 'name', direction = 'asc'): Array<Artist> {
    this.sortArtistsBy(sortkey, direction);
    return this.artists;
  }
}