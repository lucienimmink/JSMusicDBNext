import { Component, OnInit } from "@angular/core";

import { PathService } from './../utils/path.service';
import { CoreService } from './../core.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { TimeFormatPipe } from './../timeformat.pipe';

@Component({
  templateUrl: 'app/nowPlaying/nowPlaying.component.html',
  pipes: [ TimeFormatPipe ],
  styleUrls: [ 'app/nowPlaying/nowPlaying.component.css' ]
})
export class NowPlayingComponent {

    constructor(private pathService:PathService, private coreService:CoreService) {}

    ngOnInit() {
      this.pathService.announcePage('Now playing');
      let core:musicdbcore = this.coreService.getCore();

    }
}