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
        let l = letter.letter;
        let element = document.getElementById(`letter_${l}`);
        element.scrollIntoView(true);
        window.scrollBy(0, -100);
    }
}