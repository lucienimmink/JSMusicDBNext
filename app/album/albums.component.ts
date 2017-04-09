import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import { AlbumComponent } from './album.component';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { CoreService } from './../core.service';
import { PathService } from './../utils/path.service';
import { VsFor } from './../utils/ng2-vs-for';
import { Subscription } from 'rxjs/Subscription';
import { StickyDirective } from './../utils/sticky.directive';

import Artist from './../org/arielext/musicdb/models/artist';
import Album from './../org/arielext/musicdb/models/album';

@Component({
    templateUrl: './albums.component.html'
})
export class AlbumsComponent implements OnInit, OnDestroy {

    private items: Array<any> = [];
    private letters: Array<any> = [];
    private showJumpList: boolean = false;
    private cummlativeLength: Array<any> = [];
    private core: musicdbcore;
    private subscription: Subscription;
    private sorting: Array<string> = ['artist', 'year'];

    constructor(private coreService: CoreService, private pathService: PathService, private router: Router) {
        this.core = this.coreService.getCore();
        this.subscription = this.core.coreParsed$.subscribe(
            data => {
                this.ngOnInit();
            }
        )
    }

    ngOnInit() {
        let s = new Date().getTime();
        this.pathService.announcePage("Albums");
        let artists = this.core.artists;
        this.letters = this.core.sortedLetters;
        let c = this;
        let sorted = Object.keys(artists).sort(function (a, b) {
            return (a < b) ? -1 : 1;
        });
        let tmp: Array<Artist> = [];
        sorted.forEach(function (artistName) {
            tmp.push(c.core.artists[artistName]);
        });
        this.items = tmp;
        this.items.forEach(function (item, index) {
            let letterLength = c.getSize(item, index);
            if (index > 0) {
                let prevLength = c.cummlativeLength[index - 1].l
                let newLength = prevLength + letterLength;
                c.cummlativeLength[index] = {
                    l: newLength,
                    letter: item.letter.letter
                };
            } else {
                c.cummlativeLength[index] = {
                    l: letterLength,
                    letter: item.letter.letter
                };
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    navigateToAlbum(album: Album) {
        this.router.navigate(['/letter', album.artist.letter.escapedLetter, 'artist', album.artist.sortName, 'album', album.sortName])
    }
    getSize(item: any, index: number) {
        return (item.albums.length * 90) + 49;
    }
    toggleJumpList() {
        this.showJumpList = !this.showJumpList;
    }
    jumpToLetter(letter: any) {
        this.showJumpList = false;
        let c = this;

        this.items.some(function (item, i) {
            let ret = false;
            if (item.letter.letter === letter.letter) {
                let jump = (i > 0) ? i - 1 : 0;
                window.scrollTo(0, c.cummlativeLength[jump].l);
                ret = true;
            }
            return ret;
        });
    }
}