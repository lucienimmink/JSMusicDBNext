import Album from "./Album";
import Letter from "./Letter";

export default class Artist {
  name: string;
  bio: string;
  art: string;
  albums: Array<Album> = [];
  letter: Letter;
  albumArtist: string;
  sortName: string;
  isCollection: boolean;

  constructor(json: any) {
    // a dummy artist is only used to search for a core artist but is not stored in the core.
    if ((json.album && json.title) || json.dummy) {
      this.name = json.name || json.artist;
      this.albumArtist = json.albumartist || json.albumArtist;
      this.sortName = this.stripFromName((this.albumArtist) ? this.albumArtist.toUpperCase() : (json.sortName) ? json.sortName.toUpperCase() : this.name.toUpperCase(), 'the ');
      this.bio = json.bio;
      this.isCollection = (this.albumArtist) ? this.name !== this.albumArtist : false; // if albumartist doesn't exist it can't be a collection.
    }
  }

  private stripFromName(name: string, strip: string): string {
    var s = strip.toUpperCase();
    var f = name.toUpperCase();
    f = _.trim(f);
    if (_.startsWith(f, s)) {
      f = f.substring(4);
    }
    return f;
  }

  url() {
    return `/letter/${this.letter.escapedLetter}/artist/${encodeURIComponent(this.albumArtist || this.name)}/`;
  }
  sortAlbumsBy(sortkey:string = 'name', direction:string = 'asc'):void {
    this.albums.sort((a, b) => {
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
  sortAndReturnAlbumsBy(sortkey:string = 'name', direction:string = 'asc'):Array<Album> {
    this.sortAlbumsBy(sortkey, direction);
    return this.albums;
  }
}