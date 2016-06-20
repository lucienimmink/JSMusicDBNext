import { Directive, ElementRef, Input } from '@angular/core';
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
export class BackgroundArtDirective {
    private el: HTMLElement;
    public loading: boolean = false;
    public loaded: boolean = false;
    public error: boolean = false;
    private tagName: string;
    private loadingClass: string = 'loading';
    private loadedClass: string = 'loaded';
    private errorClass: string = 'error';

    @Input('backgroundArt') media: any;

    constructor(el: ElementRef, private backgroundArtService: BackgroundArtService) {
        this.el = el.nativeElement;
    }
    loadImage() {
        if (!this.loaded && !this.loading) {
            this.loading = true;
            this.addClassName(this.loadingClass);

            this.backgroundArtService.getMediaArt(this.media)
                .subscribe(
                data => this.setImage(data),
                error => {
                    this.el.style.backgroundImage = `url(${NOIMAGE})`
                    this.error = true;
                    this.loading = false;
                    this.removeClassName(this.loadingClass);
                    this.addClassName(this.errorClass);
                }
            );
        }
    }
    setImage(data: any) {
        if (!this.loaded) {
            if (data === 'global/images/no-cover.png' || data === '') {
                this.backgroundArtService.getMediaArtFromLastFm(this.media).subscribe(
                    data => this.el.style.backgroundImage = `url(${data})`,
                    error => this.el.style.backgroundImage = `url(${NOIMAGE})`
                );
            } else {
                this.el.style.backgroundImage = `url(${data})`;
            }
            this.loading = false;
            this.toggleLoaded(true);
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
    getLoadingContainer() {
        return this.el;
    }
    hasClassName(name: string) {
        return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(this.getLoadingContainer().className);
    }
    addClassName(name: string) {
        if (!this.hasClassName(name)) {
            let container = this.getLoadingContainer();
            container.className = container.className ? [container.className, name].join(' ') : name;
        }
    }
    removeClassName(name: string) {
        if (this.hasClassName(name)) {
            let container = this.getLoadingContainer();
            let c = container.className;
            container.className = c.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
        }
    }
    toggleLoaded(enable: boolean) {
        this.loaded = enable;
        if (enable) {
            this.removeClassName(this.loadingClass);
            this.addClassName(this.loadedClass);
        } else {
            this.removeClassName(this.loadedClass);
        }
    }
}