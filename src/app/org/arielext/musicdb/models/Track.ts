import Artist from './Artist';
import Album from './Album';
import MediaSource from './MediaSource';

export default class Track {

  id: string;
  source: MediaSource;
  artist: Artist;
  album: Album;
  trackArtist: string;
  duration: number;
  title: string;
  disc: number;
  number: number;
  type: string;
  isPlaying = false;
  isPaused = false;
  isLoved = false;
  position = 0;
  buffered: any = {
    start: 0,
    end: 0
  };
  showActions = false;
  date: Date;
  nowPlaying: boolean;
  image: String = '';

  constructor(json: any) {
    if (json.album && json.title) {
      this.id = json.id;
      this.duration = (json.seconds) ? json.seconds * 1000 : (json.duration && !isNaN(json.duration)) ? json.duration : 0;
      this.title = json.title;
      this.source = new MediaSource(json);
      this.disc = json.disc || this.guessBySource(json);
      this.number = json.number;
      this.trackArtist = json.artist;
      this.type = json.type || 'mp3';
    }
  }

  private guessBySource(json: any): number {
    const guessable = this.source.url;
    const discs: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (const i of discs) {
      // tslint:disable-next-line:max-line-length
      if (guessable.indexOf(` - ${i}.`) !== -1 || guessable.indexOf(`(${i}) - `) !== -1 || guessable.indexOf(`CD${i}`) !== -1 || guessable.indexOf(`\\${i}-`) !== -1) {
        return i;
      }
    }
    return 1;
  }

  url() {
    // tslint:disable-next-line:max-line-length
    return `/letter/${this.artist.letter.escapedLetter}/artist/${encodeURIComponent(this.artist.name)}/album/${encodeURIComponent(this.album.name)}/track/${encodeURIComponent(this.title)}`;
  }

  toJSON() {
    return this.id;
  }
}
