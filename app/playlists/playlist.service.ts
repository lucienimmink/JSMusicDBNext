import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { LastFMService } from './../lastfm/lastfm.service';
import { CoreService } from './../core.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import Artist from './../org/arielext/musicdb/models/Artist';
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import { Playlist } from './Playlist';

@Injectable()
export class PlaylistService {

    private core: musicdbcore;
    private username: string = localStorage.getItem('lastfm-username');
    private playlist: Playlist;
    private playlistSubject: Subject<any> = new Subject<any>();
    public playlistAnnounced$ = this.playlistSubject.asObservable();


    constructor(private coreService: CoreService, private lastfmservice: LastFMService) {
        this.core = this.coreService.getCore();
     };

    generateRandom(): any {
        let coretracknames = Object.keys(this.core.tracks);
        let randomTracks = _.shuffle(coretracknames).splice(0, 50);
        let tmpPlaylist: Playlist = new Playlist();
        tmpPlaylist.name = "50 random tracks";
        _.each(randomTracks, (id) => {
            tmpPlaylist.tracks.push(this.core.tracks[id]);
        });
        return tmpPlaylist;
    }

    generateRadio(): any {
        this.lastfmservice.getTopArtists(this.username).subscribe(
            data => {
                this.playlistSubject.next(this.extractArtists(data));
            }
        )
    }

    extractArtists(data: Array<any>): Playlist {
        let c = this;
        let highRotation: Array<Artist> = [];
        let mediumRotation: Array<Artist> = [];
        _.each(data, function (line, index) {
            let artistName: string = line.name;
            line.dummy = true // use dummy artist for lookup;
            let artist: Artist = new Artist(line);
            let foundArtist: Artist = c.core.artists[artist.sortName];
            if (foundArtist && index < 10) {
                highRotation.push(foundArtist);
            } else {
                mediumRotation.push(foundArtist);
            }
        });
        return this.generateRadioList(highRotation, mediumRotation);
    }

    generateRadioList(highRotation: Array<Artist>, mediumRotation: Array<Artist>): Playlist {
        let tmpPlaylist: Playlist = new Playlist();
        tmpPlaylist.name = "Random based on your preferences";
        
        let c = this;
        for (let i = 0; i < 50; i++) {
            if (i % 3 === 0 || i % 5 === 0) {
                tmpPlaylist.tracks.push(this.getRandomTrackFromList(highRotation));
            } else if (i % 4 === 0 || i % 7 === 0) {
                tmpPlaylist.tracks.push(this.getRandomTrackFromList(mediumRotation));
            } else {
                tmpPlaylist.tracks.push(this.getRandomTrackFromList(this.core.artistsList()));
            }
        }
        return tmpPlaylist;
    }

    private getRandomTrackFromList(list: Array<Artist>): Track {
        let randomArtist: Artist = _.shuffle(list)[0];
        if (randomArtist) {
            let randomAlbum: Album = _.shuffle(randomArtist.albums)[0];
            let randomTrack: Track = _.shuffle(randomAlbum.tracks)[0];
            if (randomTrack.duration <= 1000 * 60 * 10) {
                // only use 'small' tracks to prevent boredom or concerts
                return randomTrack;
            } else {
                return this.getRandomTrackFromList(list);
            }
        } else {
            // artist not found, get another one!
            return this.getRandomTrackFromList(list);
        }
    }
}