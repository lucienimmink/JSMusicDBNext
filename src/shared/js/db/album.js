export default class Album {
  tracks = [];
  discs = [];
  constructor(json) {
    if (json.album && json.title) {
      this.name = json.album;
      this.sortName = this.name.toUpperCase();
      this.year = json.year;
      this.modified = json.modified;
      if (this.year && this.year.indexOf('-') !== -1) {
        // eslint-disable-next-line
        this.year = this.year.split('-')[0];
      }
    }
  }
  url() {
    return `/letter/${this.artist.letter.escapedLetter}/artist/${encodeURIComponent(this.artist.name)}/album/${encodeURIComponent(this.name)}`;
  }
}
