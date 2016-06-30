import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router-deprecated';
import { AlbumComponent } from './album.component';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { CoreService } from './../core.service';
import { PathService } from './../utils/path.service';
import { IMAGELAZYLOAD_DIRECTIVE } from './../utils/imagelazyloadarea.directive';
import { VsFor } from './../utils/ng2-vs-for';

import * as _ from "lodash";

@Component({
    templateUrl: 'app/album/albums.component.html',
    directives: [AlbumComponent, IMAGELAZYLOAD_DIRECTIVE, VsFor],
    styleUrls: ['app/album/albums.component.css']
})
export class AlbumsComponent implements OnInit {

    private items: Array<any> = [];
    private letters: Array<any> = [];
    private showJumpList: boolean = false;
    private cummlativeLength: Array<number> = [];

    constructor(private coreService: CoreService, private pathService: PathService, private router: Router) { }

    ngOnInit() {
        let s = new Date().getTime();
        this.pathService.announcePage("Albums");
        let core: musicdbcore = this.coreService.getCore();
        let artists = core.artists;
        this.letters = core.sortedLetters;
        let c = this;
        let sorted = Object.keys(artists).sort(function (a, b) {
            return (a < b) ? -1 : 1;
        });
        let tmp = [];
        sorted.forEach(function (artistName) {
            tmp.push(core.artists[artistName]);
        });
        this.items = tmp;
        this.items.forEach(function (letter, index) {
            let letterLength = c.getSize(letter, index);
            if (index > 0) {
                let prevLength = c.cummlativeLength[index - 1]
                let newLength = prevLength + letterLength;
                c.cummlativeLength[index] = newLength;
            } else {
                c.cummlativeLength[index] = letterLength;
            }
        });
    }
    navigateToAlbum(album) {
        this.router.navigate(['Album', { letter: album.artist.letter.escapedLetter, artist: album.artist.sortName, album: album.sortName }]);
    }
    getSize(item, index) {
        return (item.albums.length * 70) + 69;
    }
    toggleJumpList() {
        this.showJumpList = !this.showJumpList;
    }
    jumpToLetter(letter: any) {
        this.showJumpList = false;
        let index = this.letters.indexOf(letter);
        window.scrollTo(0, this.cummlativeLength[index] - 120);
    }
}