import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { NgClass } from '@angular/common';
import { musicdbcore } from './../org/arielext/musicdb/core';
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import * as _ from 'lodash';

import { CoreService } from './../core.service';
import { AlbumComponent } from './../album/album.component';
import { BackgroundArtDirective } from './../utils/backgroundart.directive';
import { RecentlyListenedService } from './../utils/recentlyListened.service';

@Component({
  templateUrl: 'app/home/home.component.html',
  selector: 'home',
  styleUrls: [ 'app/home/home.component.css'],
  providers: [ RecentlyListenedService ]
})
export class HomeComponent {

  private core:musicdbcore;
  private recentlyListenedTracks:Array<Track> = [];

  constructor(private coreService: CoreService, private router: Router, private recentlyListened:RecentlyListenedService) { }

  ngOnInit() {
    this.core = this.coreService.getCore();
    this.recentlyListened.getRecentlyListened('arielext').subscribe(
      data => this.populate(data),
      error => console.log(error)
    )
  }

  setDate(track:any):Date {
    if (track["@attr"] && track["@attr"].nowplaying) {
      return new Date();
    } else {
      return new Date(Number(track.date.uts)*1000);
    }
  }
  setImage(track:any):String {
    // last one is the best possible quality
    return _.last(track.image)["#text"];
  }

  populate(json:any):void {
    var c:any = this;
    _.each(json, function (fmtrack) {
      var track = {
        artist: fmtrack.artist["#text"],
        album: fmtrack.album["#text"],
        title: fmtrack.name,
        image: c.setImage(fmtrack),
        nowPlaying:(fmtrack["@attr"] && fmtrack["@attr"].nowplaying) ? true : false,
        date: c.setDate(fmtrack)
      }
      c.recentlyListenedTracks.push(track);
    });
  }

  onSelect(album: any) {
    this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
  }
};