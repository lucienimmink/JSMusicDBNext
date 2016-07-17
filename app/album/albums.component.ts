import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { AlbumComponent } from './album.component';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { CoreService } from './../core.service';
import { PathService } from './../utils/path.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './../utils/imagelazyloadarea.directive';
import { VsFor } from './../utils/ng2-vs-for';
import { Subscription }   from 'rxjs/Subscription';
import { StickyDirective } from './../utils/sticky.directive';

import * as _ from "lodash";

@Component({
    templateUrl: 'app/album/albums.component.html',
    directives: [AlbumComponent, IMAGELAZYLOAD_DIRECTIVE, VsFor, StickyDirective],
    styleUrls: ['dist/album/albums.component.css']
})
export class AlbumsComponent implements OnInit, OnDestroy {

    private items: Array<any> = [];
    private letters: Array<any> = [];
    private showJumpList: boolean = false;
    private cummlativeLength: Array<any> = [];
    private core:musicdbcore;
    private subscription:Subscription;

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
        let tmp = [];
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
    navigateToAlbum(album) {
        this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
    }
    getSize(item, index) {
        return (item.albums.length * 80) + 49;
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
                let jump = (i > 0) ? i-1 : 0;
                window.scrollTo(0, c.cummlativeLength[jump].l);
                ret = true;
            }
            return ret;
        });
    }
}