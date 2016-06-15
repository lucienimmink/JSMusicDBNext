import { Component, Input, OnInit } from "@angular/core";
import Album from './../org/arielext/musicdb/models/Album';
import { AlbumArtService } from './albumart.service';

const NOIMAGE = 'global/images/no-cover.png';

@Component({
    selector: 'albumart',
    templateUrl: 'app/utils/albumart.component.html',
    providers: [AlbumArtService]
})
export class AlbumArt {
    public albumart: any = {}
    @Input() album:Album; 
    constructor(private albumArtService: AlbumArtService) {
        this.albumart = {
            url: NOIMAGE,
            name: 'unknown album'
        }
    }
    ngOnInit() {
        this.albumart.name = this.album.name;
        this.albumArtService.getAlbumArt(this.album.artist.name, this.album.name)
            .subscribe(
                data => this.setImage(data) ,
                error => this.albumart.url = NOIMAGE
            );
    }
    setImage(data:any) {
        if (data === 'global/images/no-cover.png' || data === '') {
            this.albumArtService.getMediaArtFromLastFm(this.album.artist.name, this.album.name)
                .subscribe(
                    data => this.albumart.url = data,
                    error => this.albumart.url = NOIMAGE
                )
        } else {
            this.albumart.url = data
        }
    }
}