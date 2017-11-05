import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { musicdbcore } from './../../org/arielext/musicdb/core';
import Letter from './../../org/arielext/musicdb/models/Letter';
import { CoreService } from './../../utils/core.service';

@Component({
  selector: 'mdb-letters',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.css']
})
export class LetterComponent implements OnInit, OnDestroy {
  public letters: Array<any>;
  private core: musicdbcore;
  private subscription: Subscription;
  private activeLetter: Letter = null;

  constructor(private coreService: CoreService, private router: Router) {
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

  onSelect(letter: any) {
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