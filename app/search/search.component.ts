import { Component, OnInit, OnDestroy, NgModule } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { PathService } from './../utils/path.service';
import { CoreService } from './../core.service';
import { CollectionService } from './../collection.service';
import { musicdbcore } from './../org/arielext/musicdb/core';
import { TimeFormatPipe } from './../timeformat.pipe';
import { LastFMService } from './../lastfm/lastfm.service';

import { ArtistComponent } from './../artist/artist.component';
import { AlbumComponent } from './../album/album.component';
import { TrackListComponent } from './../track/tracklist.component';
import { IMAGELAZYLOAD_DIRECTIVE } from './../utils/imagelazyloadarea.directive';

import { Subscription }   from 'rxjs/Subscription';

const MAXALLOWEDITEMS = 15;

@NgModule({
    declarations: [TimeFormatPipe, ArtistComponent, IMAGELAZYLOAD_DIRECTIVE, AlbumComponent, TrackListComponent]
})
@Component({
    templateUrl: 'app/search/search.component.html',
    styleUrls: ['dist/search/search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

    private core: musicdbcore;
    private subscription: Subscription;
    private artists:any;
    private albums:any;
    private tracks:any;
    private query:string;

    constructor(private pathService: PathService, private coreService: CoreService, private router:Router, private route:ActivatedRoute) {
        this.core = this.coreService.getCore();
        this.subscription = this.core.coreParsed$.subscribe(
            data => {
                this.ngOnInit();
            }
        )
        this.query = decodeURIComponent(this.route.snapshot.params['query']);
        this.route.params.subscribe(data => {
            this.query = data['query'];
            this.ngOnInit();
        });
    }

    ngOnInit() {
        this.pathService.announcePage(`Results for "${this.query}"`);

        this.artists = this.spliceList(this.core.searchArtist(this.query), MAXALLOWEDITEMS);
        this.albums = this.spliceList(this.core.searchAlbum(this.query), MAXALLOWEDITEMS);
        this.tracks = this.spliceList(this.core.searchTrack(this.query), MAXALLOWEDITEMS);

    }

    spliceList(results, count) {
        let ret = false;
        let view = results;
        if (results.length > count) {
            view = results.splice(0,count);
            ret = true;
        }
        return {
            list: view,
            overflow: ret
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    select(track) {
        this.router.navigate(['/letter', track.album.artist.letter.escapedLetter, 'artist', track.album.artist.sortName, 'album', track.album.sortName]);
    }
}