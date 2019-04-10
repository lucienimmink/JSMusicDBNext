import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { musicdbcore } from "./../../org/arielext/musicdb/core";
import Letter from "./../../org/arielext/musicdb/models/Letter";
import { CoreService } from "./../../utils/core.service";
import { PathService } from "./../../utils/path.service";
@Component({
  selector: "app-letters",
  templateUrl: "./letters.component.html"
})
export class LettersComponent implements OnInit, OnDestroy {
  public letters: any[] = [];
  private core: musicdbcore;
  private subscription: Subscription;

  constructor(private coreService: CoreService, private pathService: PathService, private router: Router) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(data => {
      this.ngOnInit();
    });
  }

  public ngOnInit() {
    this.pathService.announcePage("Letters");
    const core: musicdbcore = this.coreService.getCore();
    this.letters = core.sortedLetters;
  }
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  public navigateToLetter(letter: Letter) {
    this.router.navigate(["/letter", letter.escapedLetter]);
  }
}
