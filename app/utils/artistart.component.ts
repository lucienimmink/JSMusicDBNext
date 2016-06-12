import { Component } from "@angular/core";
import Artist from './../org/arielext/musicdb/models/Artist';
import { ArtistArtService } from './artistart.service';

@Component({
    selector: 'artistart',
    templateUrl: 'app/utils/artistart.component.html',
    providers: [ArtistArtService]
})
export class ArtistArt {
    public artistart: any = {}
    constructor(private artistArtService: ArtistArtService) {
        this.artistart = {
            url: '/global/images/no-cover.png',
            name: 'unknown artist'
        }
    }

    setArtist(artist: Artist): void {
        this.artistart.name = artist.name;
        this.artistArtService.getArtistArt(artist.name)
            .subscribe(
            data => this.artistart.url = data,
            error => console.log('error', error)
            );
    }
}