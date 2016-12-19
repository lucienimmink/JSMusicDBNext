import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { musicdbcore } from './../org/arielext/musicdb/core';
import Track from './../org/arielext/musicdb/models/track';

import { CoreService } from './../core.service';
import { AlbumArt } from './../utils/albumart.component';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { TimeFormatPipe } from './../timeformat.pipe';
import { PathService } from './../utils/path.service';
import { PlayerService } from './../player/player.service';
import { Subscription } from 'rxjs/Subscription';
import { StickyDirective } from './../utils/sticky.directive';
import { Playlist } from './../playlists/Playlist';
import { ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';

import { ConfigService } from './../utils/config.service';

@Component({
    templateUrl: 'app/album/albumdetail.component.html',
    styleUrls: ['dist/album/albumdetail.component.css']
})
export class AlbumDetailComponent implements OnInit, OnDestroy {
    private albumName: string = '';
    private artistName: string = '';
    private album: any;
    private core: musicdbcore;
    private subscription: Subscription;
    private albumart: AlbumArt;
    private ownPlaylists: Array<Playlist> = [];
    private selectedTrack: Track = null;
    private isSwiping: boolean = false;
    private theme:string;
    @ViewChild('editModal') private editModal: ModalDirective;

    constructor(private coreService: CoreService, private router: Router, private pathService: PathService, private playerService: PlayerService, private route: ActivatedRoute, private configService: ConfigService) {
        this.core = this.coreService.getCore();
        this.subscription = this.core.coreParsed$.subscribe(
            data => {
                this.ngOnInit();
            }
        )
        this.artistName = decodeURIComponent(this.route.snapshot.params['artist']);
        this.albumName = decodeURIComponent(this.route.snapshot.params['album']);

        this.route.params.subscribe(data => {
            this.artistName = decodeURIComponent(data["artist"]);
            this.albumName = decodeURIComponent(data["album"]);
            this.ngOnInit();
        });

        this.theme = configService.theme;
    }

    ngOnInit() {
        let c = this;
        this.album = this.core.albums[this.artistName + '|' + this.albumName];
        if (this.album) {
            this.album.sortedDiscs = []; // reset

            let namedDiscs = Object.keys(this.album.discs);
            let discnrs: Array<any> = [];
            namedDiscs.forEach(name => {
                let discnr = name.substring(5);
                discnrs.push({
                    nr: discnr,
                    id: name
                });
            });
            discnrs = discnrs.sort(function (a, b) {
                if (a.nr < b.nr) {
                    return -1;
                }
                return 1;
            });
            discnrs.forEach(disc => {
                this.album.sortedDiscs.push(this.album.discs[disc.id]);
            });
            this.pathService.announcePath({ artist: this.album.artist, album: this.album, letter: this.album.artist.letter });
        }

        // TODO this should a call from the backend
        this.ownPlaylists = [];
        if (localStorage.getItem('customlisttest')) {
            let list: Array<Playlist> = JSON.parse(localStorage.getItem('customlisttest'));
            if (list) {
                list.forEach(item => {
                    let playlist = new Playlist();
                    playlist.name = item.name;
                    playlist.tracks = item.tracks;

                    this.ownPlaylists.push(playlist);
                });
            }
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSelect(track: any, event: Event) {
        if (!this.isSwiping) {
            this.playerService.doPlayAlbum(this.album, this.album.tracks.indexOf(track), true);
        }
    }
    navigateToArtist(artist: any) {
        this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
    }
    swipe(track: Track, state: boolean, event: Event): void {
        event.preventDefault();
        this.isSwiping = true;
        setTimeout(() => {
            this.isSwiping = false;
        }, 5);
        track.showActions = state;
    }
    selectPlaylistToAddTo(track: Track): void {
        this.editModal.show();
        this.isSwiping = true;
        setTimeout(() => {
            this.isSwiping = false;
        }, 5);
        this.selectedTrack = track;
    }
    addToPlaylist(playlist: Playlist): void {
        playlist.tracks.push(this.selectedTrack);
        this.selectedTrack.showActions = false;
        this.selectedTrack = null;
        // TODO: this should be a call to the backend
        localStorage.setItem('customlisttest', JSON.stringify(this.ownPlaylists));
        this.editModal.hide();
    }
}