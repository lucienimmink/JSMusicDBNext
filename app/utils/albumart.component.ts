import { Component, Input, OnInit } from "@angular/core";
import Album from './../org/arielext/musicdb/models/Album';
import { AlbumArtService } from './albumart.service';

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
            url: '/global/images/no-cover.png',
            name: 'unknown album'
        }
    }
    ngOnInit() {
        this.albumart.name = this.album.name;
        this.albumArtService.getAlbumArt(this.album.artist.name, this.album.name)
            .subscribe(
            data => this.albumart.url = data,
            error => console.log('error', error)
            );
    }
}