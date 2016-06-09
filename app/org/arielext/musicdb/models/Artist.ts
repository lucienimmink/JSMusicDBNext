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

  constructor(json: any) {
    this.name = json.name || json.artist;
    this.albumArtist = json.albumartist || json.albumArtist;
    this.sortName = (this.albumArtist) ? this.albumArtist.toUpperCase() : (json.sortName) ? json.sortName.toUpperCase() : this.name.toUpperCase();
    this.bio = json.bio;
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