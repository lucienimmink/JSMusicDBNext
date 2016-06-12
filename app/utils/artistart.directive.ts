import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ArtistArtService } from "./artistart.service";

@Directive({
    selector: '[artistArt]',
    providers: [ ArtistArtService ]
})
export class ArtistArtDirective implements OnInit {
    private el: HTMLElement;

    @Input('artistArt') artist: any;

    constructor(el: ElementRef, private artistartservice:ArtistArtService) { 
        this.el = el.nativeElement;
    }
    ngOnInit() {
        this.artistartservice.getArtistArt(this.artist.name)
            .subscribe(
            data => this.el.style.backgroundImage = `url(${data})`,
            error => console.log('error', error)
            );
    }
}