export default class Artist {
  albums = [];
  constructor(json) {
    if ((json.album && json.title) || json.dummy) {
      this.name = json.name || json.artist || '';
      this.albumArtist = json.albumartist || json.albumArtist || '';
      this.sortName = this.stripTheFromName(
        // eslint-disable-next-line
        this.albumArtist ? this.albumArtist.toUpperCase() : json.sortName ? json.sortName.toUpperCase() : this.name.toUpperCase(),
        ['the ', '"', 'a ']
      );
      this.isCollection = this.albumArtist ? this.name !== this.albumArtist : false;
    }
  }
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
  url = () => `/letter/{escapedLetter}/artist/${encodeURIComponent(this.albumArtist || this.name)}/`;
  sortAlbumsBy(sortkey = 'name', direction = 'asc') {
    this.albums.sort((a, b) => {
      if (sortkey.indexOf('.') !== -1) {
        const sorter = sortkey.split('.');
        if (a[sorter[0]][sorter[1]] < b[sorter[0]][sorter[1]]) {
          return direction === 'asc' ? -1 : 1;
        } else if (a[sorter[0]][sorter[1]] > b[sorter[0]][sorter[1]]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
      if (a[sortkey] < b[sortkey]) {
        return direction === 'asc' ? -1 : 1;
      } else if (a[sortkey] > b[sortkey]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  sortAndReturnAlbumsBy(sortkey = 'name', direction = 'asc') {
    this.sortAlbumsBy(sortkey, direction);
    return this.albums;
  }
}
