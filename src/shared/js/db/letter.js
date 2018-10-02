export default class Letter {
  artists = [];
  constructor(line) {
    if (line.album && line.title) {
      this.letter = line.letter || this.getFirstLetterOf(line.albumArtist || line.albumartist || line.artist);
      if (this.letter === '1') {
        this.letter = '#';
      }
      this.escapedLetter = encodeURIComponent(this.letter);
    }
  }
  url = () => `/letter/${this.escapedLetter}/`;
  getFirstLetterOf = name => this.groupIfSpecialChar(this.stripTheFromName(name, ['the ', '"', 'a ']));
  stripTheFromName = (name, strip) => {
    let fullname = (name ? name.toUpperCase() : '').trim();

    strip.forEach((str) => {
      if (fullname.indexOf(str.toUpperCase()) === 0) {
        fullname = fullname.substring(str.length);
      }
      return false;
    });
    return fullname;
  };
  groupIfSpecialChar = (name) => {
    const c = name.substring(0, 1);
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '(', ')', '[', ']', '{', '}', '_', '-', '.'].indexOf(c) !== -1) {
      return '#';
    }
    return c;
  };
  sortArtistsBy(sortkey = 'sortName', direction = 'asc') {
    if (sortkey === 'albums') {
      this.artists.sort((a, b) => {
        if (a.albums.length > b.albums.length) {
          return direction === 'asc' ? -1 : 1;
        } else if (a.albums.length < b.albums.length) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else {
      this.artists.sort((a, b) => {
        if (sortkey.indexOf('.') !== -1) {
          const sorter = sortkey.split('.');
          if (a[sorter[0]][sorter[1]] < b[sorter[0]][sorter[1]]) {
            return direction === 'asc' ? -1 : 1;
          } else if (a[sorter[0]][sorter[1]] > b[sorter[0]][sorter[1]]) {
            return direction === 'asc' ? 1 : -1;
          }
          return 0;
        }
        if (a[sortkey].toUpperCase() < b[sortkey].toUpperCase()) {
          return direction === 'asc' ? -1 : 1;
        } else if (a[sortkey].toUpperCase() > b[sortkey].toUpperCase()) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
  }
  sortAndReturnArtistsBy(sortkey = 'name', direction = 'asc') {
    this.sortArtistsBy(sortkey, direction);
    return this.artists;
  }
}
