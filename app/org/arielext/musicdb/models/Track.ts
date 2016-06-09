import Artist from "./Artist";
import Album from "./Album";
import MediaSource from "./MediaSource";

export default class Track {

  id: string;
  source: MediaSource;
  artist: Artist;
  album: Album;
  duration: number;
  title: string;
  disc: number;

  constructor(json: any) {
    this.id = json.id;
    this.duration = (json.seconds) ? json.seconds * 1000 : (json.duration && !isNaN(json.duration)) ? json.duration : 0;
    this.title = json.title;
    this.source = new MediaSource(json);
    this.disc = json.disc || this.guessBySource(json);
  }

  private guessBySource(json: any): number {
    let guessable = this.source.url;
    let discs: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let i of discs) {
      if (guessable.indexOf(` - ${i}.`) !== -1 || guessable.indexOf(`(${i}) - `) !== -1 || guessable.indexOf(`CD${i}`) !== -1 || guessable.indexOf(`\\${i}-`) !== -1) {
        return i;
      }
    }
    return 1;
  }

  url() {
    return `/letter/${this.artist.letter.escapedLetter}/artist/${encodeURIComponent(this.artist.name)}/album/${encodeURIComponent(this.album.name)}/track/${encodeURIComponent(this.title)}`;
  }
}