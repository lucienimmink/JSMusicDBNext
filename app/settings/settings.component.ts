import { Component, OnInit, OnDestroy } from "@angular/core";

import { PathService } from './../utils/path.service';
import { CoreService } from './../core.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { TimeFormatPipe } from './../timeformat.pipe';

import { Subscription }   from 'rxjs/Subscription';

@Component({
  templateUrl: 'app/settings/settings.component.html',
  pipes: [TimeFormatPipe],
  styleUrls: ['app/settings/settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  private totals: any;
  private core: musicdbcore;
  private subscription: Subscription;

  constructor(private pathService: PathService, private coreService: CoreService) {
    this.core = this.coreService.getCore();
    this.subscription = this.core.coreParsed$.subscribe(
      data => {
        this.ngOnInit();
      }
    )
  }

  ngOnInit() {
    this.pathService.announcePage('Settings');
    this.totals = this.core.totals;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}