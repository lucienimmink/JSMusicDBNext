import { Component, OnInit } from "@angular/core";

import { PathService } from './../utils/path.service';
import { CoreService } from './../core.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { TimeFormatPipe } from './../timeformat.pipe';

@Component({
  templateUrl: 'app/settings/settings.component.html',
  pipes: [ TimeFormatPipe ],
  styleUrls: [ 'app/settings/settings.component.css' ]
})
export class SettingsComponent {

  private totals:any;

    constructor(private pathService:PathService, private coreService:CoreService) {}

    ngOnInit() {
      this.pathService.announcePage('Settings');
      let core:musicdbcore = this.coreService.getCore();
      this.totals = core.totals;
    }
}