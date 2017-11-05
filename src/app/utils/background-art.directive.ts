import { Directive, ElementRef, Input } from '@angular/core';
import { BackgroundArtService } from './background-art.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

//import * as PouchDB from 'pouchdb';
import PouchDB from 'pouchdb'

@Directive({
  selector: '[mdb-BackgroundArt]',
  providers: [BackgroundArtService]
})
export class BackgroundArtDirective {
  NOIMAGE = 'global/images/no-cover.png';
  arttable = new PouchDB('art');

  private el: HTMLElement;
  public loading: boolean = false;
  public loaded: boolean = false;
  public error: boolean = false;
  private tagName: string;
  private loadingClass: string = 'loading';
  private loadedClass: string = 'loaded';
  private errorClass: string = 'error';

  @Input('mdb-BackgroundArt') media: any;

  constructor(el: ElementRef, private backgroundArtService: BackgroundArtService) {
    this.el = el.nativeElement;
    // this.loadImage(); // always load image
    setTimeout(() => {
      this.loadImage();
    }, 100);
  }
  loadImage() {
    if ((!this.loaded && !this.loading) || this.hasClassName('always-replace')) {
      this.loading = true;
      this.addClassName(this.loadingClass);

      let key = `art-${this.media.name}`;
      let c = this;

      if (this.media.artist && !this.media.trackArtist) {
        key = `art-${this.media.artist.name}-${this.media.name}`;
      } else if (this.media.trackArtist) {
        key = `art-${this.media.trackArtist}-${this.media.album.name}`;
      }
      this.arttable.get(key, function (err: any, data: any) {
        if (data) {
          c.setImage(data.url);
        } else {
          c.backgroundArtService.getMediaArt(c.media)
            .subscribe(
            data => c.setImage(data),
            error => {
              c.el.style.backgroundImage = `url(${this.NOIMAGE})`
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
    let dsm = localStorage.getItem('dsm');
    if (dsm) {
      dsm = dsm + '/data/image-proxy?url=';
    }
    if (!this.loaded || this.hasClassName('always-replace')) {
      if (data === this.NOIMAGE || data === '' || !data) {
        this.backgroundArtService.getMediaArtFromLastFm(this.media).subscribe(
          data => {
            if (data && data !== this.NOIMAGE) {
              this.el.style.backgroundImage = `url(${dsm}${encodeURIComponent(data)})`;
            } else {
              if (!data) {
                data = this.NOIMAGE;
              }
              this.el.style.backgroundImage = `url(${data})`;
            }

            let item = {
              _id: `art-${this.media.name}`,
              url: data
            };
            if (this.media.artist) {
              item._id = `art-${this.media.artist.name}-${this.media.name}`
            }
            this.arttable.put(item, function (err: any, response: any) {
              // boring
            });
          },
          error => this.el.style.backgroundImage = `url(${this.NOIMAGE})`
        );
      } else {
        this.el.style.backgroundImage = `url(${dsm}${encodeURIComponent(data)})`;

        let item = {
          _id: `art-${this.media.name}`,
          url: data
        };
        if (this.media.artist) {
          item._id = `art-${this.media.artist.name}-${this.media.name}`
        }
        this.arttable.put(item, function (err: any, respons: any) {
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
