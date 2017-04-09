import Artist from './models/Artist';
import Album from './models/Album';
import Track from './models/Track';
import Letter from './models/Letter';
import Year from './models/Year';
import { Subject } from 'rxjs/Subject';

const VERSION: string = "1.2.2";

export class musicdbcore {

    public artists: INameToValueMap = {};
    public albums: INameToValueMap = {};
    public tracks: INameToValueMap = {};
    public letters: INameToValueMap = {};
    public years: INameToValueMap = {};
    public sortedLetters: Array<Letter> = [];
    public sortedAlbums: Array<Album> = [];

    private coreParsedSource = new Subject<any>();
    coreParsed$ = this.coreParsedSource.asObservable();

    public totals: any = {
        artists: 0,
        albums: 0,
        tracks: 0,
        playingTime: 0,
        parsingTime: 0
    }

    private latestAdditions: Array<Album> = [];

    constructor() {
        console.info(`Core init ${VERSION}`);

    }

    public resetCollection() {
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
        }

        this.latestAdditions = [];
    }

    private instanceIfPresent(core: any, key: any, map: INameToValueMap, obj: Object, excecuteIfNew: Function): any {
        var ret: any = null;
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
        return this.instanceIfPresent(this, letter.letter, this.letters, letter, function (core: any) { });
    }
    private handleArtist(letter: Letter, artist: Artist): Artist {
        return this.instanceIfPresent(this, artist.sortName, this.artists, artist, function (core: any) {
            letter.artists.push(artist);
            artist.letter = letter;
            core.totals.artists++;
        });
    }
    private handleAlbum(artist: Artist, album: Album): Album {
        return this.instanceIfPresent(this, artist.sortName + '|' + album.sortName, this.albums, album, function (core: any) {
            album.artist = artist;
            artist.albums.push(album);
            artist.sortAndReturnAlbumsBy('year', 'asc');
            core.sortedAlbums.push(album);
            core.totals.albums++;
            if (core.years[album.year]) {
                core.years[album.year].albums.push(album);
            } else {
                let year = new Year(album);
                year.albums.push(album);
                core.years[year.year] = year;
            }
        });
    }
    private handleTrack(artist: Artist, album: Album, track: Track): Track {
        return this.instanceIfPresent(this, track.id, this.tracks, track, function (core: any) {
            core.totals.tracks++;
            core.totals.playingTime += track.duration;
            track.artist = artist;
            track.album = album;
            album.tracks.push(track);
            // group by discnumber
            let disc = track.disc;
            if (!album.discs[`disc-${disc}`]) {
                album.discs[`disc-${disc}`] = [];
                album.discs[`disc-${disc}`].push(track);
            } else {
                album.discs[`disc-${disc}`].push(track);
            }
            // sort if needed
            album.discs[`disc-${disc}`].sort(function (a, b) {
                if (a.number < b.number) {
                    return -1;
                }
                return 1;
            });
            if (album.type && album.type !== track.type) {
                album.type = 'mixed';
            } else {
                album.type = track.type;
            }

            // sort all tracks firstly by disc, then by number
            album.tracks.sort(function (a, b) {
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
        });
    }

    private parseLine(line: any): void {
        let letter: Letter = new Letter(line);
        if (letter.letter) {
            letter = this.handleLetter(letter);
        }
        let artist = new Artist(line);
        if (artist.name) {
            artist = this.handleArtist(letter, artist);
        }
        let album = new Album(line);
        if (album.name) {
            album = this.handleAlbum(artist, album);
        }
        let track = new Track(line);
        if (track.title) {
            track = this.handleTrack(artist, album, track);
        }
    };


    private parseTree(tree: any): void {
        for (let l in tree) {
            let letter: Letter = new Letter(tree[l]);
            letter = this.handleLetter(letter);
            for (let a in tree[l].artists) {
                // add artist in letter
                let artist: Artist = new Artist(tree[l].artists[a]);
                artist = this.handleArtist(letter, artist);
                for (let aa in tree[l].artists[a].albums) {
                    // add albums in artist in letter
                    let album: Album = new Album(tree[l].artists[a].albums[aa]);
                    album = this.handleAlbum(artist, album);
                    for (let t in tree[l].artists[a].albums[aa].tracks) {
                        let track: Track = new Track(tree[l].artists[a].albums[aa].tracks[t]);
                        track = this.handleTrack(artist, album, track);
                    }
                }
            }
        }
    };
    parseSourceJson(json: any): void {
        let start: number = new Date().getTime();
        if (json.length) {
            // this json is flat; all lines in the json is 1 track
            for (let line of json) {
                this.parseLine(line);
            }
        } else if (json.tree) {
            // this json is build up as an object; with nested data
            this.parseTree(json.tree);
        }
        // sort letters
        let sorted = Object.keys(this.letters).sort(function (a, b) {
            return (a < b) ? -1 : 1;
        });
        let t = [];
        let core = this;
        sorted.forEach(function (value, index) {
            t.push(core.letters[value]);
            core.letters[value].sortAndReturnArtistsBy('name', 'asc');
        });
        this.sortedLetters = t;
        // update parsing time
        this.totals.parsingTime += (new Date().getTime() - start);
        this.coreParsedSource.next(true);

    }
    getTrackByArtistAndName(artistName: string, trackName: string): Track {
        let artist = new Artist({ name: artistName, dummy: true });
        let coreArtist = this.artists[artist.sortName];
        let ret: Track = null;
        if (coreArtist) {
            coreArtist.albums.some((album) => {
                album.tracks.some((track) => {
                    if (track.title && (track.title.toLowerCase() === trackName.toLowerCase())) {
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
    getTrackById(id: string): Track {
        let c = this;
        let ret = new Track({});
        this.tracks.forEach(track => {
            if (track.id === id) {
                ret = track;
            }

        });
        return ret;
    }
    getArtistByName(artistName: string): Artist {
        let artist = new Artist({ name: artistName, dummy: true });
        let coreArtist = this.artists[artist.sortName];
        return coreArtist;
    }
    getAlbumByArtistAndName(artist: Artist, albumName: string): Album {
        let ret = null;
        artist.albums.forEach((album) => {
            //console.log(album.name, albumName);
            if (album.name.toLowerCase() === albumName.toLowerCase()) {
                ret = album;
            }
        });
        return ret;
    }
    getTrackByAlbumAndName(album: Album, trackName: string): Track {
        let ret = null;
        album.tracks.forEach((track) => {
            if (track.title.toLowerCase() === trackName.toLowerCase()) {
                ret = track;
            }
        });
        return ret;
    }
    artistsList(): Array<Artist> {
        let c = this;
        let ret: Array<Artist> = [];
        let sorted = Object.keys(this.artists).sort(function (a, b) {
            return (a < b) ? -1 : 1;
        });
        sorted.forEach(function (value, index) {
            ret.push(c.artists[value]);
        });
        return ret;
    }
    searchArtist(query: string): Array<Artist> {
        let ret = [];
        let artistnames = Object.keys(this.artists);
        artistnames = artistnames.filter(name => {
            if (name.indexOf(query.toUpperCase()) !== -1) {
                return true;
            }
        });
        artistnames.forEach(name => {
            ret.push(this.artists[name]);
        });
        return ret;
    }
    searchAlbum(query: string): Array<Album> {
        let c = this;
        let ret = [];
        let albumnames = Object.keys(this.albums);
        albumnames = albumnames.filter(name => {
            name = name.substring(name.indexOf('|'));
            if (name.indexOf(query.toUpperCase()) !== -1) {
                return true;
            }
        });
        albumnames.forEach(name => {
            ret.push(this.albums[name]);
        })
        return ret;
    }
    searchTrack(query: string): Array<Track> {
        let c = this;
        let ret = [];
        let tracks = Object.keys(this.tracks);
        tracks = tracks.filter(title => {
            let track = this.tracks[title];
            if (track.title.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                return true;
            }
        })

        tracks.forEach(name => {
            ret.push(this.tracks[name]);
        })
        return ret;
    }
    getLatestAdditions(amount: number = 10): Array<Album> {
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
    getNextAlbum (album:Album):Album {
        let artist = album.artist;
        let albumIndex = artist.albums.indexOf(album);
        let nextAlbum = artist.albums[albumIndex + 1];
        if (!nextAlbum) {
            // get next artist
            let nextArtist = this.getNextArtist(artist);
            nextAlbum = nextArtist.albums[0];
        }
        return nextAlbum;
    }
    getNextArtist(artist:Artist):Artist {
        let letter = artist.letter;
        let artistIndex = letter.artists.indexOf(artist);
        let nextArtist = letter.artists[artistIndex + 1];
        if (!nextArtist) {
            let nextLetter = this.getNextLetter(letter);
            nextArtist = nextLetter.artists[0];
        }
        return nextArtist;
    }
    getNextLetter(letter:Letter):Letter {
        let letterIndex = this.sortedLetters.indexOf(letter);
        let nextLetter = this.sortedLetters[letterIndex + 1];
        if (!nextLetter) {
            nextLetter = this.sortedLetters[0];
        }
        return nextLetter;
    }
}