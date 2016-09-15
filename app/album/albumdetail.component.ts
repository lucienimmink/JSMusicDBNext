import { Component, OnInit, OnDestroy, NgModule } from "@angular/core";
import { Router } from '@angular/router';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';
import { AlbumArt } from './../utils/albumart.component';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { TimeFormatPipe } from './../timeformat.pipe';
import { PathService } from './../utils/path.service';
import { PlayerService } from './../player/player.service';
import { Subscription }   from 'rxjs/Subscription';
import { StickyDirective } from './../utils/sticky.directive';

@NgModule({
    declarations: [ TimeFormatPipe, AlbumArt, BackgroundArtDirective, StickyDirective ]
})
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

    constructor(private coreService: CoreService, private router: Router, private pathService: PathService, private playerService: PlayerService) {
        this.core = this.coreService.getCore();
        this.subscription = this.core.coreParsed$.subscribe(
            data => {
                this.ngOnInit();
            }
        )
    }

    ngOnInit() {
        let c = this;
        //this.albumName = decodeURIComponent(this.routeParams.get('album'));
        //this.artistName = decodeURIComponent(this.routeParams.get('artist'));
        this.albumName = "asbsolution",
        this.artistName = "MUSE";
        this.album = this.core.albums[this.artistName + '|' + this.albumName];
        if (this.album) {
            this.album.sortedDiscs = []; // reset

            let namedDiscs = Object.keys(this.album.discs);
            let discnrs = [];
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
            this.pathService.announcePath({ artist: this.album.artist, album: this.album });
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