import Artist from "./Artist";
import Track from "./Track";

export default class Album {

  name:string;
  sortName:string;
  artist:Artist;
  tracks:Array<Track> = [];
  discs:Array<any> = [];
  sortedDiscs:Array<any> = [];
  year:number;
  art:string;

  constructor (json:any){
    if (json.album && json.title) {
      this.name = json.album;
      this.sortName = this.name.toUpperCase();
      this.year = json.year;
    }
  }
  url() {
    return `/letter/${this.artist.letter.escapedLetter}/artist/${encodeURIComponent(this.artist.name)}/album/${encodeURIComponent(this.name)}`;
  }
}