import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import { musicdbcore } from './../org/arielext/musicdb/core';
import Letter from './../org/arielext/musicdb/models/Letter';
import { Subscription }   from 'rxjs/Subscription';
import { CoreService } from './../core.service';


@Component({
  selector: 'letters',
  templateUrl: './letter.component.html'
})
export class LetterComponent implements OnInit, OnDestroy {
  private letters:Array<any>;
  private core:musicdbcore;
  private subscription: Subscription;
  private activeLetter:Letter = null;

  constructor (private coreService: CoreService, private router: Router) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(
      data => {
        this.ngOnInit();
      }
    )
  }

  ngOnInit() {
    this.letters = this.core.sortedLetters;
  }

  onSelect(letter:any) {
    if (this.activeLetter) {
      this.activeLetter.active = false;
    }
    this.activeLetter = letter;
    this.router.navigate(['/letter', letter.escapedLetter]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}