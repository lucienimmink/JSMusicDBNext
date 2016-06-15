import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { BackgroundArtService } from "./backgroundart.service";

@Directive({
    selector: '[backgroundArt]',
    providers: [ BackgroundArtService ]
})
export class BackgroundArtDirective implements OnInit {
    private el: HTMLElement;

    @Input('backgroundArt') media: any;

    constructor(el: ElementRef, private backgroundArtService:BackgroundArtService) {
        this.el = el.nativeElement;
    }
    ngOnInit() {
        this.backgroundArtService.getMediaArt(this.media)
            .subscribe(
            data => this.setImage(data),
            error => console.log('error', error)
            );
    }
    setImage(data:any) {
        if (data === 'global/images/no-cover.png') {
            this.backgroundArtService.getMediaArtFromLastFm(this.media).subscribe(
                data => this.el.style.backgroundImage = `url(${data})`,
                error => console.log('error', error)
            );
        } else {
            this.el.style.backgroundImage = `url(${data})`;
        }
    }
}