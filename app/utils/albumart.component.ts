import { Component, Input, OnInit, OnChanges } from "@angular/core";
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import { AlbumArtService } from './albumart.service';
import { AlbumArtObject } from './AlbumArt';
import * as PouchDB from 'pouchdb';

const NOIMAGE = 'global/images/no-cover.png';

let arttable = new PouchDB('art');

@Component({
    selector: 'albumart',
    templateUrl: './albumart.component.html',
    providers: [AlbumArtService]
})
export class AlbumArt {
    public albumart: AlbumArtObject = new AlbumArtObject();
    @Input() album: Album;
    @Input() track: Track;

    private searchArtist: string;
    private searchAlbum: string;
    private searchType: string = 'album';
    private arttable = arttable;

    constructor(private albumArtService: AlbumArtService) {
        const art = new AlbumArtObject();
        art.name = 'unknown album';
        art.url = NOIMAGE;
        this.albumart = art;
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
        this.arttable.get(key, function (err: any, data: any) {
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

    ngOnChanges(changes) {
        this.ngOnInit();
    }
    setImage(data: any) {
        let dsm = localStorage.getItem('dsm');
        if (dsm) {
            dsm = dsm + '/data/image-proxy?url=';
        }
        if (data === 'global/images/no-cover.png' || data === '' || !data) {
            this.albumArtService.getMediaArtFromLastFm(this.searchArtist, this.searchAlbum, this.searchType)
                .subscribe(
                data => {
                    if (data && data !== 'global/images/no-cover.png') {
                        this.albumart.url = `${dsm}${encodeURIComponent(data)}`;
                    } else {
                        if (!data) {
                            data = NOIMAGE;
                        }
                        this.albumart.url = data;
                    }
                    let item = {
                        _id: `art-${this.searchArtist}-${this.searchAlbum}`,
                        url: data
                    };
                    this.arttable.put(item, function (err: any, response: any) {
                        // boring
                    });
                },
                error => this.albumart.url = NOIMAGE
                )
        } else {
            this.albumart.url = `${dsm}${encodeURIComponent(data)}`;
            let item = {
                _id: `art-${this.searchArtist}-${this.searchAlbum}`,
                url: data
            };
            this.arttable.put(item, function (err: any, response: any) {
                // boring
            });
        }
    }
}