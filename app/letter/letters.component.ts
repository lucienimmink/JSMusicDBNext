import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { LetterComponent } from './letter.component';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { CoreService } from './../core.service';
import { PathService } from './../utils/path.service';

@Component({
  templateUrl: 'app/letter/letters.component.html',
  styleUrls: ['dist/letter/letters.component.css']
})
export class LettersComponent implements OnInit {

  private letters: Array<any> = [];

  constructor(private coreService: CoreService, private pathService: PathService, private router: Router) { }

  ngOnInit() {
    this.pathService.announcePage("Letters");
    let core: musicdbcore = this.coreService.getCore();
    this.letters = core.sortedLetters;
  }
  navigateToLetter(letter) {
    this.router.navigate(['Letter', { letter: letter.escapedLetter }]);
  }
}