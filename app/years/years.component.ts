import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import { AlbumComponent } from './../album/album.component';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { CoreService } from './../core.service';
import { PathService } from './../utils/path.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './../utils/imagelazyloadarea.directive';
import { VsFor } from './../utils/ng2-vs-for';
import { Subscription }   from 'rxjs/Subscription';
import { StickyDirective } from './../utils/sticky.directive';

import * as _ from "lodash";

@Component({
    templateUrl: 'app/years/years.component.html',
    styleUrls: ['dist/years/years.component.css']
})
export class YearsComponent implements OnInit, OnDestroy {

    private items: Array<any> = [];
    private years: Array<any> = [];
    private showJumpList: boolean = false;
    private cummlativeLength: Array<any> = [];
    private core: musicdbcore;
    private subscription: Subscription;

    constructor(private coreService: CoreService, private pathService: PathService, private router: Router) {
        this.core = this.coreService.getCore();
        this.subscription = this.core.coreParsed$.subscribe(
            data => {
                this.ngOnInit();
            }
        )
    }

    ngOnInit() {
        this.pathService.announcePage("Years");
        let c = this;
        let yearsobject = this.core.years;
        let sorted = Object.keys(yearsobject).sort(function (a, b) {
            return (parseInt(a) < parseInt(b)) ? 1 : -1;
        });
        let tmp = [];
        sorted.forEach(function (year) {
            if (year !== 'undefined') {
                tmp.push(c.core.years[year]);
                c.years.push(year);
            }
        });
        this.items = tmp;
        this.items.forEach(function (item, index) {
            let letterLength = c.getSize(item, index);
            if (index > 0) {
                let prevLength = c.cummlativeLength[index - 1].l
                let newLength = prevLength + letterLength;
                c.cummlativeLength[index] = {
                    l: newLength,
                    year: item.year.year
                };
            } else {
                c.cummlativeLength[index] = {
                    l: letterLength,
                    year: item.year.year
                };
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    navigateToAlbum(album) {
        this.router.navigate(['/letter', album.artist.letter.escapedLetter, 'artist', album.artist.sortName, 'album', album.sortName])
    }
    getSize(item, index) {
        return (item.albums.length * 80) + 39;
    }
    toggleJumpList() {
        this.showJumpList = !this.showJumpList;
    }
    jumpToLetter(year: any) {
        this.showJumpList = false;
        let c = this;

        this.items.some(function (item, i) {
            let ret = false;
            if (item.year === parseInt(year)) {
                let jump = (i > 0) ? i - 1 : 0;
                if (jump === 0) {
                    window.scrollTo(0,0);
                } else {
                    window.scrollTo(0, c.cummlativeLength[jump].l);
                }
                ret = true;
            }
            return ret;
        });
    }
}