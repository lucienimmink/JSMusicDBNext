import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';
import { AlbumArt } from './../utils/albumart.component';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { TimeFormatPipe } from './../timeformat.pipe';
import { PathService } from './../utils/path.service';
import { PlayerService } from './../player/player.service';
import { Subscription } from 'rxjs/Subscription';
import { StickyDirective } from './../utils/sticky.directive';

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

    constructor(private coreService: CoreService, private router: Router, private pathService: PathService, private playerService: PlayerService, private route: ActivatedRoute) {
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
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSelect(track: any) {
        this.playerService.doPlayAlbum(this.album, this.album.tracks.indexOf(track));
    }
    navigateToArtist(artist: any) {
        this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
    }
}