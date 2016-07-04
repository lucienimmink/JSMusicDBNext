import { Directive, ElementRef, Input } from '@angular/core';
import { BackgroundArtService } from "./backgroundart.service";

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

import * as PouchDB from 'pouchdb';

// use logic from https://github.com/NathanWalker/ng2-image-lazy-load/blob/master/src/client/app/directives/image-lazy-load.directive.ts
// implement workerlogic as well for best performance

const NOIMAGE = 'global/images/no-cover.png';

let arttable = new PouchDB('art');

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
    private arttable = arttable;

    @Input('backgroundArt') media: any;

    constructor(el: ElementRef, private backgroundArtService: BackgroundArtService) {
        this.el = el.nativeElement;
    }
    loadImage() {
        if ((!this.loaded && !this.loading) || this.hasClassName('always-replace')) {
            this.loading = true;
            this.addClassName(this.loadingClass);

            let key = `art-${this.media.name}`;
            let c = this;

            if (this.media.artist) {
                key = `art-${this.media.artist.name}-${this.media.name}`;
            }
            this.arttable.get(key, function (err, data) {
                if (data) {
                    c.setImage(data.url);
                } else {
                    c.backgroundArtService.getMediaArt(c.media)
                        .subscribe(
                        data => c.setImage(data),
                        error => {
                            c.el.style.backgroundImage = `url(${NOIMAGE})`
                            c.error = true;
                            c.loading = false;
                            c.removeClassName(c.loadingClass);
                            c.addClassName(c.errorClass);
                        }
                        );
                }
            });
        }
    }
    setImage(data: any) {
        if (!this.loaded || this.hasClassName('always-replace')) {
            if (data === 'global/images/no-cover.png' || data === '') {
                this.backgroundArtService.getMediaArtFromLastFm(this.media).subscribe(
                    data => {
                        this.el.style.backgroundImage = `url(${data})`;

                        let item = {
                            _id: `art-${this.media.name}`,
                            url: data
                        };
                        if (this.media.artist) {
                            item._id = `art-${this.media.artist.name}-${this.media.name}`
                        }
                        this.arttable.put(item, function (err, response) {
                            // boring
                        });
                    },
                    error => this.el.style.backgroundImage = `url(${NOIMAGE})`
                );
            } else {
                this.el.style.backgroundImage = `url(${data})`;

                let item = {
                    _id: `art-${this.media.name}`,
                    url: data
                };
                if (this.media.artist) {
                    item._id = `art-${this.media.artist.name}-${this.media.name}`
                }
                this.arttable.put(item, function (err, response) {
                    // boring
                });
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