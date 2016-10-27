import { Component, OnInit, NgModule, OnDestroy } from "@angular/core";
import { PlayerService } from './../player/player.service';
import { PathService } from './../utils/path.service';
import { CoreService } from './../core.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { TimeFormatPipe } from './../timeformat.pipe';
import { Router } from '@angular/router';
import { TrackListComponent } from './../track/tracklist.component';
import { Subscription } from 'rxjs/Subscription';
import { LastFMService } from './../lastfm/lastfm.service';
import Artist from './../org/arielext/musicdb/models/Artist';
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import * as _ from 'lodash';
import { StickyDirective } from './../utils/sticky.directive';
import { ConfigService } from './../utils/config.service';

@NgModule({
    declarations: [TimeFormatPipe, TrackListComponent, StickyDirective]
})
@Component({
    templateUrl: 'app/playlists/playlists.component.html',
    styleUrls: ['dist/playlists/playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

    private subscription: Subscription;
    private subscription2: Subscription;
    private playlist;
    private currentPlaylist;
    private track;
    private trackIndex;
    private core: musicdbcore;
    private loading: boolean = false;
    private username: string = localStorage.getItem('lastfm-username');
    private showStartingArtist: boolean = false;
    private artists: Array<Artist> = [];
    private startingArtistName: string;
    private theme: string;

    constructor(private pathService: PathService, private coreService: CoreService, private router: Router, private playerService: PlayerService, private lastfmservice: LastFMService, private configService: ConfigService) {
        // this is for when we open the page; just wanting to know the current state of the playerService
        let playerData = this.playerService.getCurrentPlaylist();
        if (playerData) {
            this.currentPlaylist = playerData.playlist;
            this.trackIndex = playerData.startIndex;
            this.setTrack();
        }
        // this is for when a new track is announced while we are already on the page
        this.subscription = this.playerService.playlistAnnounced$.subscribe(
            playerData => {
                this.currentPlaylist = playerData.playlist;
                this.trackIndex = playerData.startIndex;
                this.setTrack();
            }
        )
        this.core = this.coreService.getCore();
        this.subscription2 = this.core.coreParsed$.subscribe(
            data => {
                this.ngOnInit();
            }
        )
        this.theme = configService.theme;
    }

    setTrack() {
        this.track = this.currentPlaylist.tracks[this.trackIndex];
        if (this.track) {
            this.track.position = 0;
        }
    }

    ngOnInit() {
        this.pathService.announcePage('Playlists');
        this.artists = this.core.artistsList();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription2.unsubscribe();
    }
    setPlaylist(name: string) {
        this.loading = true;
        this.showStartingArtist = false;
        if (name === "current") {
            this.playlist = this.currentPlaylist;
            this.loading = false;
        } else if (name === 'last.fm') {
            this.lastfmservice.getLovedTracks(this.username).subscribe(
                data => {
                    this.playlist = this.extractTracks(data);
                    this.loading = false;
                }
            )
        } else if (name === 'random') {
            this.playlist = this.generateRandom();
            this.loading = false;
        } else if (name === 'radio') {
            this.playlist = this.generateRadio();
        } else if (name === 'artist') {
            this.askForStartingArtist();
        } else {
            console.log('unknown playlist', name);
        }
    }
    extractTracks(data: Array<any>): any {
        let tmpPlaylist = {
            name: "Loved tracks on Last.FM",
            tracks: []
        }
        let c = this;
        _.each(data, function (line) {
            let artistName: string = line.artist.name;
            let trackName: string = line.name;
            let track: any = c.core.getTrackByArtistAndName(artistName, trackName);
            if (track) {
                tmpPlaylist.tracks.push(track);
            }
        });
        return tmpPlaylist;
    }
    generateRandom(): any {
        let coretracknames = Object.keys(this.core.tracks);
        let randomTracks = _.shuffle(coretracknames).splice(0, 50);
        let tmpPlaylist = {
            name: "50 random tracks",
            tracks: []
        }
        let c = this;
        _.each(randomTracks, function (id) {
            tmpPlaylist.tracks.push(c.core.tracks[id]);
        });
        return tmpPlaylist;
    }
    generateRadio(): any {
        this.lastfmservice.getTopArtists(this.username).subscribe(
            data => {
                this.playlist = this.extractArtists(data);
                this.loading = false;
            }
        )
    }
    extractArtists(data: Array<any>): any {
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
    generateRadioList(highRotation: Array<Artist>, mediumRotation: Array<Artist>) {
        let tmpPlaylist = {
            name: "Random based on your preferences",
            tracks: []
        }
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
            return randomTrack;
        } else {
            // artist not found, get another one!
            return this.getRandomTrackFromList(list);
        }
    }
    private askForStartingArtist(): void {
        this.loading = false;
        this.playlist = null;
        this.showStartingArtist = true;
    }
    onChange() {
        let startArtist = this.core.getArtistByName(this.startingArtistName);
        let tmpPlaylist = {
            name: `Artist radio for ${startArtist.name}`,
            tracks: [
                this.getRandomTrackFromList([startArtist])
            ]
        }
        this.showStartingArtist = false;
        this.playlist = tmpPlaylist;

        this.getNextSimilairArtist(startArtist, this.playlist);

    }
    getNextSimilairArtist(artist:Artist, playlist:any):void {
        // get a similair artist from last.fm
        this.loading = true;
        this.lastfmservice.getSimilairArtists(artist).subscribe(
            data => {
                this.loading = false;
                let c = this;
                let foundSimilair:Array<Artist> = [];
                _.each(data, function (lastfmartist) {
                    let name = lastfmartist.name;
                    let coreArtist = c.core.getArtistByName(name)
                    if (coreArtist && foundSimilair.length < 5) {
                        foundSimilair.push(coreArtist);
                    }
                });
                // the next similair artist is ...
                if (foundSimilair.length > 0) {
                    let nextArtist = foundSimilair[Math.floor(Math.random() * foundSimilair.length)];
                    // but use a random for adding it to the list; to keep it .. moar random!
                    playlist.tracks.push(this.getRandomTrackFromList(foundSimilair));

                    if (playlist.tracks.length < 50) {
                        this.getNextSimilairArtist(nextArtist, playlist);
                    }
                }
                // if no new similair artists are found this is the end of the line.
            }
        )
    }
    
}