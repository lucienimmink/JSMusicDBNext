import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { ArtistComponent } from './artist.component';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { CoreService } from './../core.service';
import { PathService } from './../utils/path.service';

import * as _ from "lodash";

@Component({
  templateUrl: 'app/artist/artists.component.html',
  directives: [ ArtistComponent ],
  styleUrls: [ 'app/artist/artists.component.css' ]
})
export class ArtistsComponent implements OnInit {

    private letters:Array<any> = [];

    constructor (private coreService: CoreService, private pathService: PathService) {}

    ngOnInit() {
      this.pathService.announcePage("Artists");
      let core:musicdbcore = this.coreService.getCore();
      this.letters = core.sortedLetters;
    }
}