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
  private lastfmusername: string;
  private connectiontype:string = "node-mp3stream"; // we can implement more connection types later on (dsm, local, etc)
  private connectiondetails:string = "";
  private subscription: Subscription;
  private savePlaylistState: boolean = false;

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
    this.lastfmusername = localStorage.getItem("lastfm-username") || '';
    let jwt = JSON.parse(localStorage.getItem("jwt"));
    if (jwt) {
      this.connectiondetails = jwt.dsmport;
    } else {
      this.connectiondetails = null;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeLastfm() {
    localStorage.removeItem('lastfm-username');
    localStorage.removeItem('lastfm-token');
    this.ngOnInit();
  }
  removeConnection() {
    localStorage.removeItem("jwt");
    sessionStorage.removeItem("jwt");
    this.ngOnInit();
  }
  toggleSavePlaylistState() {
    this.savePlaylistState = !this.savePlaylistState;
    localStorage.setItem('save-playlist-state', this.savePlaylistState.toString());
  }
}