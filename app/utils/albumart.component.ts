import { Component } from "@angular/core";
import Album from './../org/arielext/musicdb/models/Album';
import { AlbumArtService } from './albumart.service';

@Component({
    selector: 'albumart',
    templateUrl: 'app/utils/albumart.component.html',
    providers: [AlbumArtService]
})
export class AlbumArt {
    public albumart: any = {}
    constructor(private albumArtService: AlbumArtService) {
        this.albumart = {
            url: '/global/images/no-cover.png',
            name: 'unknown album'
        }
    }

    setAlbum(album: Album): void {
        this.albumart.name = album.name;
        this.albumArtService.getAlbumArt(album.artist.name, album.name)
            .subscribe(
            data => this.albumart.url = data,
            error => console.log('error', error)
            );
    }
}