import Artist from './Artist';
import Track from './Track';

export default class Album {

  public name: string;
  public sortName: string;
  public artist: Artist;
  public tracks: Track[] = [];
  public discs: any[] = [];
  public sortedDiscs: any[] = [];
  public year: any;
  public art: string;
  public modified = 0;
  public type: string;
  public isContinues = true;

  constructor (json: any) {
    if (json.album && json.title) {
      this.name = json.album;
      this.sortName = this.name.toUpperCase();
      this.year = json.year;
      this.modified = json.modified;

      // strip month/day from universal date strings
      if (this.year && this.year.indexOf('-') !== -1) {
        this.year = this.year.split('-')[0];
      }
    }
  }
  public url() {
    // tslint:disable-next-line:max-line-length
    return `/letter/${this.artist.letter.escapedLetter}/artist/${encodeURIComponent(this.artist.name)}/album/${encodeURIComponent(this.name)}`;
  }
}
