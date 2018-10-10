import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { LetterComponent } from "./../letter/letter.component";
import { musicdbcore } from "./../../org/arielext/musicdb/core";
import Letter from "./../../org/arielext/musicdb/models/letter";
import { CoreService } from "./../../utils/core.service";
import { PathService } from "./../../utils/path.service";

@Component({
  templateUrl: "./letters.component.html"
})
export class LettersComponent implements OnInit, OnDestroy {
  public letters: Array<any> = [];
  private core: musicdbcore;
  private subscription: Subscription;

  constructor(
    private coreService: CoreService,
    private pathService: PathService,
    private router: Router
  ) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.pathService.announcePage("Letters");
    const core: musicdbcore = this.coreService.getCore();
    this.letters = core.sortedLetters;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  navigateToLetter(letter: Letter) {
    this.router.navigate(["/letter", letter.escapedLetter]);
  }
}