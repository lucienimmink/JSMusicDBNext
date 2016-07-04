import { Component, Input, OnInit } from "@angular/core";
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import { AlbumArtService } from './albumart.service';
import * as PouchDB from 'pouchdb';

const NOIMAGE = 'global/images/no-cover.png';

let arttable = new PouchDB('art');

@Component({
    selector: 'albumart',
    templateUrl: 'app/utils/albumart.component.html',
    styleUrls: ['dist/utils/albumart.component.css'],
    providers: [AlbumArtService]
})
export class AlbumArt {
    public albumart: any = {}
    @Input() album: Album;
    @Input() track: Track;

    private searchArtist: string;
    private searchAlbum: string;
    private searchType: string = 'album';
    private arttable = arttable;

    constructor(private albumArtService: AlbumArtService) {
        this.albumart = {
            url: NOIMAGE,
            name: 'unknown album'
        }
    }

    ngOnInit() {
        let key = '';
        if (this.album) {
            // album
            this.albumart.name = this.album.name;
            this.searchArtist = this.album.artist.albumArtist || this.album.artist.name;
            this.searchAlbum = this.album.name;
            key = `art-${this.searchArtist}-${this.searchAlbum}`;
        } else {
            // track
            this.albumart.name = this.track.album.name;
            this.searchArtist = this.track.trackArtist;
            this.searchAlbum = this.track.album.name;
            if (this.track.album.artist.isCollection) {
                this.searchType = 'artist';
                key = `art-${this.searchArtist}`;
            } else {
                this.searchType = 'album';
                key = `art-${this.searchArtist}-${this.searchAlbum}`;
            }
        }

        let c = this;
        this.arttable.get(key, function (err, data) {
            if (data) {
                c.setImage(data.url);
            } else {
                c.albumArtService.getAlbumArt(c.searchArtist, c.searchAlbum, c.searchType)
                    .subscribe(
                    data => c.setImage(data),
                    error => c.albumart.url = NOIMAGE
                    );
            }
        });


    }
    setImage(data: any) {
        if (data === 'global/images/no-cover.png' || data === '') {
            this.albumArtService.getMediaArtFromLastFm(this.searchArtist, this.searchAlbum, this.searchType)
                .subscribe(
                data => {
                    this.albumart.url = data;
                    let item = {
                        _id: `art-${this.searchArtist}-${this.searchAlbum}`,
                        url: data
                    };
                    this.arttable.put(item, function (err, response) {
                        // boring
                    });
                },
                error => this.albumart.url = NOIMAGE
                )
        } else {
            this.albumart.url = data;
            let item = {
                _id: `art-${this.searchArtist}-${this.searchAlbum}`,
                url: data
            };
            this.arttable.put(item, function (err, response) {
                // boring
            });
        }
    }
}