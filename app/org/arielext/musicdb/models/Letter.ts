import Artist from "./Artist";
import * as _ from "lodash";

export default class Letter {

  letter: string;
  escapedLetter: string;
  artists: Array<Artist> = [];

  constructor(json: any) {
    this.letter = this.getFirstLetterOf(json.letter || json.albumArtist || json.artist);
    this.escapedLetter = encodeURIComponent(this.letter);
  };
  url() {
    return `/letter/${this.escapedLetter}/`;
  };
  private getFirstLetterOf(name:string):string {
    return this.stripFromName(name, 'the ');
  };
  private stripFromName(name:string, strip:string):string {
    var s = strip.toUpperCase();
    var f = name.toUpperCase();
    f = _.trim(f);
    f = _.trimStart(f, s);
    return this.groupIfSpecialChar(_.split(f, '', 1)[0]);
  }
  private groupIfSpecialChar(c:string):string {
    if (_.indexOf(['1','2','3','4','5','6','7','8','9','0', '(', ')', '[', ']', '{', '}', '_', '-', '.'], c) !== -1) {
      return '#';
    }
    return c;
  }
  sortArtistsBy(sortkey:string = 'name', direction:string = 'asc'):void {
    this.artists.sort((a,b) => {
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
      if (a[sortkey] < b[sortkey]) {
        return (direction === 'asc') ? -1 : 1;
      } else if (a[sortkey] > b[sortkey]) {
        return (direction === 'asc') ? 1 : -1;
      }
      return 0;
    });
  }
  sortAndReturnArtistsBy(sortkey:string = 'name', direction = 'asc'):Array<Artist> {
    this.sortArtistsBy(sortkey, direction);
    return this.artists;
  }
}