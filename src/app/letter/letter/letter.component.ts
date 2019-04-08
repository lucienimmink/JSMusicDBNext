import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { musicdbcore } from "./../../org/arielext/musicdb/core";
import Letter from "./../../org/arielext/musicdb/models/Letter";
import { CoreService } from "./../../utils/core.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "mdb-letters",
  templateUrl: "./letter.component.html"
})
export class LetterComponent implements OnInit, OnDestroy {
  public letters: any[];
  private core: musicdbcore;
  private subscription: Subscription;
  private activeLetter: Letter = null;

  constructor(private coreService: CoreService, private router: Router) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
  }

  public ngOnInit() {
    this.letters = this.core.sortedLetters;
  }

  public onSelect(letter: any) {
    if (this.activeLetter) {
      this.activeLetter.active = false;
    }
    this.activeLetter = letter;
    this.router.navigate(["/letter", letter.escapedLetter]);
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
