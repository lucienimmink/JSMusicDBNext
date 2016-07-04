import { Component, Input, OnInit } from "@angular/core";
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import { AlbumArtService } from './albumart.service';

const NOIMAGE = 'global/images/no-cover.png';

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

    private searchArtist:string;
    private searchAlbum:string;
    private searchType:string = 'album';

    constructor(private albumArtService: AlbumArtService) {
        this.albumart = {
            url: NOIMAGE,
            name: 'unknown album'
        }
    }

    ngOnInit() {
        if (this.album) {
            // album
            this.albumart.name = this.album.name;
            this.searchArtist = this.album.artist.albumArtist || this.album.artist.name;
            this.searchAlbum = this.album.name;
        } else {
            // track
            this.albumart.name = this.track.album.name;
            this.searchArtist = this.track.trackArtist;
            this.searchAlbum = this.track.album.name;
            if (this.track.album.artist.isCollection) {
                this.searchType = 'artist';
            } else {
                this.searchType = 'album';
            }
        }

        this.albumArtService.getAlbumArt(this.searchArtist, this.searchAlbum, this.searchType)
            .subscribe(
            data => this.setImage(data),
            error => this.albumart.url = NOIMAGE
            );
    }
    setImage(data: any) {
        if (data === 'global/images/no-cover.png' || data === '') {
            this.albumArtService.getMediaArtFromLastFm(this.searchArtist, this.searchAlbum, this.searchType)
                .subscribe(
                data => {
                    this.albumart.url = data
                    localStorage.setItem(`art-${this.searchArtist}-${this.searchAlbum}`, data);
                },
                error => this.albumart.url = NOIMAGE
                )
        } else {
            localStorage.setItem(`art-${this.searchArtist}-${this.searchAlbum}`, data);
            this.albumart.url = data
        }
    }
}