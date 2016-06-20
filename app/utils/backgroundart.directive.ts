import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { BackgroundArtService } from "./backgroundart.service";

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

// use logic from https://github.com/NathanWalker/ng2-image-lazy-load/blob/master/src/client/app/directives/image-lazy-load.directive.ts
// implement workerlogic as well for best performance

const NOIMAGE = 'global/images/no-cover.png';

@Directive({
    selector: '[backgroundArt]',
    providers: [BackgroundArtService]
})
export class BackgroundArtDirective implements OnInit {
    private el: HTMLElement;
    private scrollSubscription: Subscription;
    private threshold: number = 100;

    @Input('backgroundArt') media: any;

    constructor(el: ElementRef, private backgroundArtService: BackgroundArtService) {
        this.el = el.nativeElement;
    }
    ngOnInit() {
        let ePos = this.getPosition();
        if (this.isInView(ePos)) {
            // load the inital set
            this.loadImage();
        }
        if (!this.scrollSubscription) {
            this.scrollSubscribe();
        }
    }

    // we should create a directive for the scrollpane on which we listen for this event (now we listen on ALL possible images)
    scrollSubscribe() {
        let scrollStream = Observable.fromEvent(window, 'scroll').debounceTime(250);

        this.scrollSubscription = scrollStream.subscribe(() => {
            let ePos = this.getPosition();
            if (this.isInView(ePos)) {
                this.loadImage();
            }
        });
    }
    isInView(ePos):boolean {
        if (ePos.bottom > 0 && (ePos.bottom >= (window.pageYOffset - this.threshold)) && (ePos.top <= ((window.pageYOffset + window.innerHeight) + this.threshold))) {
            return true;
        }
        return false;
    }
    loadImage() {
        this.backgroundArtService.getMediaArt(this.media)
            .subscribe(
            data => this.setImage(data),
            error => this.el.style.backgroundImage = `url(${NOIMAGE})`
            );
    }
    setImage(data: any) {
        if (data === 'global/images/no-cover.png' || data === '') {
            this.backgroundArtService.getMediaArtFromLastFm(this.media).subscribe(
                data => this.el.style.backgroundImage = `url(${data})`,
                error => this.el.style.backgroundImage = `url(${NOIMAGE})`
            );
        } else {
            this.el.style.backgroundImage = `url(${data})`;
        }
    }
    getPosition() {
        let box = this.el.getBoundingClientRect();
        let top = box.top + (window.pageYOffset - document.documentElement.clientTop);
        return {
            top: top,
            left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
            bottom: top + this.el.clientHeight
        };
    }
}