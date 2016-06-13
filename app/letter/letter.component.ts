import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { CoreService } from './../core.service';


@Component({
  selector: 'letters',
  templateUrl: 'app/letter/letter.component.html',
  styleUrls: [ 'app/letter/letter.component.css' ]
})
export class LetterComponent implements OnInit {
  private letters:Array<any>;
  
  constructor (private coreService: CoreService, private router: Router) {}

  ngOnInit() {
    let core:musicdbcore = this.coreService.getCore();
    this.letters = core.sortedLetters;
  }

  onSelect(letter:any) {
    this.router.navigate(['Letter', { letter: letter.escapedLetter }]);
  }
}