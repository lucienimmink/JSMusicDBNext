import Artist from "./Artist";
import Track from "./Track";

export default class Album {

  name:string;
  sortName:string;
  artist:Artist;
  tracks:Array<Track> = [];
  discs:Array<any> = [];
  sortedDiscs:Array<any> = [];
  year:any;
  art:string;
  modified:number = 0;
  type:string;
  isContinues:boolean = true;

  constructor (json:any){
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
  url() {
    return `/letter/${this.artist.letter.escapedLetter}/artist/${encodeURIComponent(this.artist.name)}/album/${encodeURIComponent(this.name)}`;
  }
}