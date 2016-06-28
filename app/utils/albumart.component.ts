import { Component, Input, OnInit } from "@angular/core";
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import { AlbumArtService } from './albumart.service';

const NOIMAGE = 'global/images/no-cover.png';

@Component({
    selector: 'albumart',
    templateUrl: 'app/utils/albumart.component.html',
    providers: [AlbumArtService]
})
export class AlbumArt {
    public albumart: any = {}
    @Input() album: Album;
    @Input() track: Track;

    constructor(private albumArtService: AlbumArtService) {
        this.albumart = {
            url: NOIMAGE,
            name: 'unknown album'
        }
    }

    ngOnInit() {
        if (this.album) {
            this.albumart.name = this.album.name;
        } else {
            this.albumart.name = this.track.album.name;
        }
        this.albumArtService.getAlbumArt((this.album) ? (this.album.artist.albumArtist || this.album.artist.name) : (this.track.album.artist.albumArtist || this.track.album.artist.name), (this.album) ? this.album.name : this.track.album.name)
            .subscribe(
            data => this.setImage(data),
            error => this.albumart.url = NOIMAGE
            );
    }
    setImage(data: any) {
        if (data === 'global/images/no-cover.png' || data === '') {
            this.albumArtService.getMediaArtFromLastFm((this.album) ? (this.album.artist.albumArtist || this.album.artist.name) : (this.track.album.artist.albumArtist || this.track.album.artist.name), (this.album) ? this.album.name : this.track.album.name)
                .subscribe(
                data => this.albumart.url = data,
                error => this.albumart.url = NOIMAGE
                )
        } else {
            this.albumart.url = data
        }
    }
}