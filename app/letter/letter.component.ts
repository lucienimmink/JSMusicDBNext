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
  private core:musicdbcore;
  
  constructor (private coreService: CoreService, private router: Router) {
    this.core = this.coreService.getCore();
    this.core.coreParsed$.subscribe(
      data => {
        this.ngOnInit();
      }
    )
  }

  ngOnInit() {
    
    this.letters = this.core.sortedLetters;
  }

  onSelect(letter:any) {
    this.router.navigate(['Letter', { letter: letter.escapedLetter }]);
  }
}