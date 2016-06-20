import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { BackgroundArtService } from "./backgroundart.service";

// use logic from https://github.com/NathanWalker/ng2-image-lazy-load/blob/master/src/client/app/directives/image-lazy-load.directive.ts
// implement workerlogic as well for best performance

const NOIMAGE = 'global/images/no-cover.png';

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
            error => this.el.style.backgroundImage = `url(${NOIMAGE})`
            );
    }
    setImage(data:any) {
        if (data === 'global/images/no-cover.png' || data === '') {
            this.backgroundArtService.getMediaArtFromLastFm(this.media).subscribe(
                data => this.el.style.backgroundImage = `url(${data})`,
                error => this.el.style.backgroundImage = `url(${NOIMAGE})`
            );
        } else {
            this.el.style.backgroundImage = `url(${data})`;
        }
    }
}