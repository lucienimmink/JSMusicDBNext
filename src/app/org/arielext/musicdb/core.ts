import { Subject } from "rxjs";
import Album from "./models/Album";
import Artist from "./models/Artist";
import Letter from "./models/Letter";
import Search from "./models/Search";
import Track from "./models/Track";
import Year from "./models/Year";

const VERSION = "1.6.1";

// tslint:disable-next-line:class-name
export class musicdbcore {
  public artists: INameToValueMap = {};
  public albums: INameToValueMap = {};
  public tracks: INameToValueMap = {};
  public letters: INameToValueMap = {};
  public years: INameToValueMap = {};
  public sortedLetters: Letter[] = [];
  public sortedAlbums: Album[] = [];

  public isCoreParsed = false;
  public coreParsedSource = new Subject<any>();
  public coreParsed$ = this.coreParsedSource.asObservable();

  public totals: any = {
    artists: 0,
    albums: 0,
    tracks: 0,
    playingTime: 0,
    parsingTime: 0
  };

  private latestAdditions: Album[] = [];
  private search: Search = new Search();

  constructor() {
    // tslint:disable-next-line:no-console
    console.info(`Core init ${VERSION}`);
  }

  public resetCollection(): void {
    this.artists = {};
    this.albums = {};
    this.tracks = {};
    this.letters = {};
    this.years = {};
    this.sortedLetters = [];
    this.sortedAlbums = [];

    this.totals = {
      artists: 0,
      albums: 0,
      tracks: 0,
      playingTime: 0,
      parsingTime: 0
    };

    this.latestAdditions = [];
  }
  public parseSourceJson(json: any, isFlacSupported: boolean = true): void {
    const start: number = new Date().getTime();
    if (json.length) {
      // this json is flat; all lines in the json is 1 track
      for (const line of json) {
        this.parseLine(line, isFlacSupported);
      }
    } else if (json.tree) {
      // this json is build up as an object; with nested data
      this.parseTree(json.tree);
    }
    // sort letters
    const sorted: any = Object.keys(this.letters).sort(
      (a: any, b: any): number => {
        return a < b ? -1 : 1;
      }
    );
    const t: any[] = [];
    // let core = this;
    sorted.forEach((value, index) => {
      t.push(this.letters[value]);
      this.letters[value].sortAndReturnArtistsBy("name", "asc");
    });
    this.sortedLetters = t;
    // update parsing time
    this.totals.parsingTime += new Date().getTime() - start;
    this.coreParsedSource.next(true);
    this.isCoreParsed = true;
  }
  public getTrackByArtistAndName(artistName: string, trackName: string): Track {
    const artist: Artist = new Artist({ name: artistName, dummy: true });
    const coreArtist: any = this.artists[artist.sortName];
    let ret: Track = null;
    if (coreArtist) {
      coreArtist.albums.some(album => {
        album.tracks.some(track => {
          if (
            track.title &&
            track.title.toLowerCase() === trackName.toLowerCase()
          ) {
            if (!ret) {
              ret = track;
            }
            return true; // break out of the some itterator
          }
        });
      });
    }
    return ret;
  }
  public getTrackById(id: string): Track {
    let ret: Track = new Track({});
    this.tracks.forEach(track => {
      if (track.id === id) {
        ret = track;
      }
    });
    return ret;
  }
  public getArtistByName(artistName: string): Artist {
    const artist: Artist = new Artist({ name: artistName, dummy: true });
    const coreArtist: any = this.artists[artist.sortName];
    return coreArtist;
  }
  public getAlbumByArtistAndName(artist: Artist, albumName: string): Album {
    let ret: Album = null;
    artist.albums.forEach(album => {
      // console.info(album.name, albumName);
      if (album.name.toLowerCase() === albumName.toLowerCase()) {
        ret = album;
      }
    });
    return ret;
  }
  public getTrackByAlbumAndName(album: Album, trackName: string): Track {
    let ret: Track = null;
    album.tracks.forEach(track => {
      if (track.title.toLowerCase() === trackName.toLowerCase()) {
        ret = track;
      }
    });
    return ret;
  }
  public artistsList(): Artist[] {
    const ret: Artist[] = [];
    const sorted: any = Object.keys(this.artists).sort(
      (a: any, b: any): number => {
        return a < b ? -1 : 1;
      }
    );
    sorted.forEach((value, index) => {
      ret.push(this.artists[value]);
    });
    return ret;
  }
  public trackList(): Track[] {
    const ret: Track[] = [];
    const sorted: any = Object.keys(this.tracks).sort(
      (a: any, b: any): number => {
        return a < b ? -1 : 1;
      }
    );
    sorted.forEach((value, index) => {
      ret.push(this.tracks[value]);
    });
    return ret;
  }
  public searchArtist(query: string): any {
    return this.search.doSearch({ query, list: this.artistsList() });
  }
  public searchAlbum(query: string): any {
    return this.search.doSearch({ query, list: this.sortedAlbums });
  }
  public searchTrack(query: string): any {
    return this.search.doSearch({
      query,
      keys: ["title"],
      list: this.trackList()
    });
  }
  public getLatestAdditions(amount: number = 14): Album[] {
    if (this.latestAdditions.length !== 0) {
      return this.latestAdditions;
    }
    this.sortedAlbums.sort((a, b) => {
      if (a.modified > b.modified) {
        return -1;
      } else if (a.modified < b.modified) {
        return 1;
      } else {
        return 0;
      }
    });
    this.latestAdditions = this.sortedAlbums.splice(0, amount);
    return this.latestAdditions;
  }
  public getNextAlbum(album: Album): Album {
    const artist: Artist = album.artist;
    const albumIndex: number = artist.albums.indexOf(album);
    let nextAlbum: Album = artist.albums[albumIndex + 1];
    if (!nextAlbum) {
      // get next artist
      const nextArtist: Artist = this.getNextArtist(artist);
      nextAlbum = nextArtist.albums[0];
    }
    return nextAlbum;
  }
  public getNextArtist(artist: Artist): Artist {
    const letter: Letter = artist.letter;
    const artistIndex: number = letter.artists.indexOf(artist);
    let nextArtist: Artist = letter.artists[artistIndex + 1];
    if (!nextArtist) {
      const nextLetter: Letter = this.getNextLetter(letter);
      nextArtist = nextLetter.artists[0];
    }
    return nextArtist;
  }
  public getNextLetter(letter: Letter): Letter {
    const letterIndex: number = this.sortedLetters.indexOf(letter);
    let nextLetter: Letter = this.sortedLetters[letterIndex + 1];
    if (!nextLetter) {
      nextLetter = this.sortedLetters[0];
    }
    return nextLetter;
  }

  private instanceIfPresent(
    core: any,
    key: any,
    map: INameToValueMap,
    obj: object,
    excecuteIfNew
  ): any {
    let ret: any = null;
    if (map[key]) {
      ret = map[key];
    } else {
      map[key] = obj;
      ret = obj;
      excecuteIfNew(core);
    }
    return ret;
  }
  private handleLetter(letter: Letter): Letter {
    return this.instanceIfPresent(
      this,
      letter.letter,
      this.letters,
      letter,
      (core: any): void => {
        return;
      }
    );
  }
  private handleArtist(letter: Letter, artist: Artist): Artist {
    return this.instanceIfPresent(
      this,
      artist.sortName,
      this.artists,
      artist,
      (core: any): void => {
        letter.artists.push(artist);
        artist.letter = letter;
        core.totals.artists++;
      }
    );
  }
  private handleAlbum(
    artist: Artist,
    album: Album,
    isFlacSupported: boolean = true
  ): Album {
    return this.instanceIfPresent(
      this,
      artist.sortName + "|" + album.sortName,
      this.albums,
      album,
      (core: any): void => {
        if (
          (album.type === "flac" && isFlacSupported) ||
          album.type !== "flac"
        ) {
          album.artist = artist;
          artist.albums.push(album);
          artist.sortAndReturnAlbumsBy("year", "asc");
          core.sortedAlbums.push(album);
          core.totals.albums++;
          if (core.years[album.year]) {
            core.years[album.year].albums.push(album);
          } else {
            const year: Year = new Year(album);
            year.albums.push(album);
            core.years[year.year] = year;
          }
        }
      }
    );
  }
  private handleTrack(
    artist: Artist,
    album: Album,
    track: Track,
    isFlacSupported: boolean = true
  ): Track {
    return this.instanceIfPresent(
      this,
      track.id,
      this.tracks,
      track,
      (core: any): void => {
        album.type =
          album.type && album.type !== track.type ? "mixed" : track.type;
        if (
          (track.type === "flac" && isFlacSupported) ||
          track.type !== "flac"
        ) {
          core.totals.tracks++;
          core.totals.playingTime += track.duration;
          track.artist = artist;
          track.album = album;
          album.tracks.push(track);
          // group by discnumber
          const disc: number = track.disc;
          if (!album.discs[`disc-${disc}`]) {
            album.discs[`disc-${disc}`] = [];
            album.discs[`disc-${disc}`].push(track);
          } else {
            album.discs[`disc-${disc}`].push(track);
          }
          // sort if needed
          album.discs[`disc-${disc}`].sort((a: any, b: any): number => {
            if (a.number < b.number) {
              return -1;
            }
            return 1;
          });

          // sort all tracks firstly by disc, then by number
          album.tracks.sort((a: any, b: any): number => {
            if (a.disc < b.disc) {
              return -1;
            }
            if (a.disc === b.disc) {
              if (a.number < b.number) {
                return -1;
              } else {
                return 1;
              }
            }
            return 1;
          });
        } else {
          console.warn("skipping flac track, flac is not supported");
        }
      }
    );
  }

  private parseLine(line: any, isFlacSupported: boolean = true): void {
    let letter: Letter = new Letter(line);
    if (letter.letter) {
      letter = this.handleLetter(letter);
    }
    let artist: Artist = new Artist(line);
    if (artist.name) {
      artist = this.handleArtist(letter, artist);
    }
    let album: Album = new Album(line);
    if (album.name) {
      album = this.handleAlbum(artist, album, isFlacSupported);
    }
    let track: Track = new Track(line);
    if (track.title) {
      track = this.handleTrack(artist, album, track, isFlacSupported);
    }
  }

  private parseTree(tree: any): void {
    // tslint:disable-next-line:forin
    for (const l in tree) {
      let letter: Letter = new Letter(tree[l]);
      letter = this.handleLetter(letter);
      // tslint:disable-next-line:forin
      for (const a in tree[l].artists) {
        // add artist in letter
        let artist: Artist = new Artist(tree[l].artists[a]);
        artist = this.handleArtist(letter, artist);
        // tslint:disable-next-line:forin
        for (const aa in tree[l].artists[a].albums) {
          // add albums in artist in letter
          let album: Album = new Album(tree[l].artists[a].albums[aa]);
          album = this.handleAlbum(artist, album);
          // tslint:disable-next-line:forin
          for (const t in tree[l].artists[a].albums[aa].tracks) {
            let track: Track = new Track(
              tree[l].artists[a].albums[aa].tracks[t]
            );
            track = this.handleTrack(artist, album, track);
          }
        }
      }
    }
  }
}
