import Album from './Album';
import Letter from './Letter';

export default class Artist {
  public name: string;
  public bio: string;
  public art: string;
  public albums: Album[] = [];
  public letter: Letter;
  public albumArtist: string;
  public sortName: string;
  public isCollection: boolean;

  constructor(json: any) {
    // a dummy artist is only used to search for a core artist but is not stored in the core.
    if ((json.album && json.title) || json.dummy) {
      this.name = json.name || json.artist || '';
      this.albumArtist = json.albumartist || json.albumArtist || '';
      // tslint:disable-next-line:max-line-length
      this.sortName = this.stripFromName((this.albumArtist) ? this.albumArtist.toUpperCase() : (json.sortName) ? json.sortName.toUpperCase() : this.name.toUpperCase(), ['the ', '"', 'a ']);
      this.bio = json.bio;
      this.isCollection = (this.albumArtist) ? this.name !== this.albumArtist : false;
    }
  }

  public url() {
    return `/letter/${this.letter.escapedLetter}/artist/${encodeURIComponent(this.albumArtist || this.name)}/`;
  }
  public sortAlbumsBy(sortkey: string = 'name', direction: string = 'asc'): void {
    this.albums.sort((a, b) => {
      if (sortkey.indexOf('.') !== -1) {
        const sorter = sortkey.split('.');
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
  public sortAndReturnAlbumsBy(sortkey: string = 'name', direction: string = 'asc'): Album[] {
    this.sortAlbumsBy(sortkey, direction);
    return this.albums;
  }

  private stripFromName(name: string, strip: string[]): string {
    let f = (name) ? name.toUpperCase() : '';
    f = f.trim();
    strip.forEach((str) => {
      const s = str.toUpperCase();
      if (f.indexOf(s) === 0) {
        f = f.substring(s.length);
      }
    });
    return f;
  }
}
