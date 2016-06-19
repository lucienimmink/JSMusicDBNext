
import Artist from './models/Artist';
import Album from './models/Album';
import Track from './models/Track';
import Letter from './models/Letter';
import * as _ from "lodash";

const VERSION: string = "1.0.0";

export class musicdbcore {

    public artists: INameToValueMap = {};
    public albums: INameToValueMap = {};
    public tracks: INameToValueMap = {};
    public letters: INameToValueMap = {};
    public sortedLetters:Array<Letter> = [];

    public totals: any = {
        artists: 0,
        albums: 0,
        tracks: 0,
        playingTime: 0,
        parsingTime: 0
    }

    constructor() {
        console.log(`Core init ${VERSION}`);

    }

    private instanceIfPresent(core: any, key: string, map: INameToValueMap, obj: Object, excecuteIfNew: Function): any {
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
        return this.instanceIfPresent(this, artist.sortName+'|'+album.sortName, this.albums, album, function (core: any) {
            album.artist = artist;
            artist.albums.push(album);
            core.totals.albums++;
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
            if (!album.discs[disc-1]) {
                album.discs[disc-1] = [];
                album.discs[disc-1].push(track);
            } else {
                album.discs[disc-1].push(track);
            }
        });
    }

    private parseLine(line: any): void {
        let letter: Letter = new Letter(line);
        letter = this.handleLetter(letter);

        let artist = new Artist(line);
        artist = this.handleArtist(letter, artist);
        
        let album = new Album(line);
        album = this.handleAlbum(artist, album);

        let track = new Track(line);
        track = this.handleTrack(artist, album, track);
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
        let start:number = new Date().getTime();
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
        let sorted = Object.keys(this.letters).sort(function (a,b) {
            return (a < b) ? -1 : 1;
        });
        let t = [];
        let core = this;
        sorted.forEach(function (value, index) {
            t.push(core.letters[value]);
        });
        this.sortedLetters = t;
        // update parsing time
        this.totals.parsingTime += (new Date().getTime() - start);
    }
    getTrackByArtistAndName(artistName:string, trackName:string):Track {
        let artist = new Artist({name: artistName});
        let coreArtist = this.artists[artist.sortName];
        let ret:Track = null;
        if (coreArtist) {
            _.each(coreArtist.albums, function (album) {
                _.each(album.tracks, function (track) {
                    if (track.title.toLowerCase() === trackName.toLowerCase()) {
                        ret = track;
                    }
                });
            });
        }
        return ret;
    }
}