import MediaSource from './mediasource';

export default class Track {
  constructor(json) {
    if (json.album && json.title) {
      this.id = json.id;
      // eslint-disable-next-line
      this.duration = json.seconds ? json.seconds * 1000 : json.duration && !isNaN(json.duration) ? json.duration : 0;
      this.title = json.title;
      this.source = new MediaSource(json);
      this.disc = json.disc || this.guessBySource(this.source);
      this.number = json.number;
      this.trackArtist = json.artist;
      this.type = json.type || 'mp3';
    }
  }
  guessBySource(source) {
    const guessable = source.url;
    const discs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    discs.forEach((i) => {
      if (
        guessable.indexOf(` - ${i}.`) !== -1 ||
        guessable.indexOf(`(${i}) - `) !== -1 ||
        guessable.indexOf(`CD${i}`) !== -1 ||
        guessable.indexOf(`\\${i}-`) !== -1
      ) {
        return i;
      }
      return 1;
    });
    return 1;
  }

  url() {
    // eslint-disable-next-line
    return `/letter/${this.artist.letter.escapedLetter}/artist/${encodeURIComponent(this.artist.name)}/album/${encodeURIComponent(
      this.album.name)}/track/${encodeURIComponent(this.title)}`;
  }

  toJSON() {
    return this.id;
  }
}
