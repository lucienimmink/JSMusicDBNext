import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import { LetterComponent } from './letter.component';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { CoreService } from './../core.service';
import { PathService } from './../utils/path.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
    templateUrl: 'app/letter/letters.component.html',
    styleUrls: ['dist/letter/letters.component.css']
})
export class LettersComponent implements OnInit, OnDestroy {

    private letters: Array<any> = [];
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
        this.pathService.announcePage("Letters");
        let core: musicdbcore = this.coreService.getCore();
        this.letters = core.sortedLetters;
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    navigateToLetter(letter) {
        this.router.navigate(['Letter', { letter: letter.escapedLetter }]);
    }
}