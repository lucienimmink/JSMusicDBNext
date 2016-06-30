import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { ArtistComponent } from './artist.component';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { CoreService } from './../core.service';
import { PathService } from './../utils/path.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './../utils/imagelazyloadarea.directive';
import { VsFor } from './../utils/ng2-vs-for';
import { Subscription }   from 'rxjs/Subscription';

import * as _ from "lodash";

@Component({
    templateUrl: 'app/artist/artists.component.html',
    directives: [ArtistComponent, IMAGELAZYLOAD_DIRECTIVE, VsFor],
    styleUrls: ['app/artist/artists.component.css']
})
export class ArtistsComponent implements OnInit, OnDestroy {

    private letters: Array<any> = [];
    private showJumpList: boolean = false;
    private core: musicdbcore;
    private subscription: Subscription;
    private cummlativeLength: Array<number> = [];

    constructor(private coreService: CoreService, private pathService: PathService, private router: Router) {
        this.core = this.coreService.getCore();
        this.subscription = this.core.coreParsed$.subscribe(
            data => {
                this.ngOnInit();
            }
        )
    }

    ngOnInit() {
        this.pathService.announcePage("Artists");
        this.letters = this.core.sortedLetters;
        let c = this;
        this.letters.forEach(function (letter, index) {
            let letterLength = c.getSize(letter, index);
            if (index > 0) {
                let prevLength = c.cummlativeLength[index -1]
                let newLength = prevLength + letterLength;
                c.cummlativeLength[index] = newLength;
            } else {
                c.cummlativeLength[index] = letterLength;
            }
        });

    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    navigateToArtist(artist) {
        this.router.navigate(['Artist', { letter: artist.letter.escapedLetter, artist: artist.sortName }]);
    }
    getSize(item, index) {
        return (item.artists.length * 70) + 69;
    }
    toggleJumpList() {
        this.showJumpList = !this.showJumpList;
    }
    jumpToLetter(letter: any) {
        this.showJumpList = false;
        let index = this.letters.indexOf(letter);
        window.scrollTo(0, this.cummlativeLength[index] - 120);
    }
}