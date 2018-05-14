import { Directive, ElementRef, Input } from "@angular/core";
import { set, get } from "idb-keyval";
import { BackgroundArtService } from "./background-art.service";

import { Observable ,  Subscription } from "rxjs";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/operator/debounceTime";

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: "[mdb-BackgroundArt]",
  providers: [BackgroundArtService]
})
export class BackgroundArtDirective {
  NOIMAGE = "global/images/no-cover.png";

  private el: HTMLElement;
  public loading = false;
  public loaded = false;
  public error = false;
  private tagName: string;
  private loadingClass = "loading";
  private loadedClass = "loaded";
  private errorClass = "error";

  // tslint:disable-next-line:no-input-rename
  @Input("mdb-BackgroundArt") media: any;

  constructor(
    el: ElementRef,
    private backgroundArtService: BackgroundArtService
  ) {
    this.el = el.nativeElement;
    // this.loadImage(); // always load image
    setTimeout(() => {
      this.loadImage();
    }, 100);
  }
  loadImage() {
    if (
      (!this.loaded && !this.loading) ||
      this.hasClassName("always-replace")
    ) {
      this.loading = true;
      this.addClassName(this.loadingClass);

      let key = `art-${this.media.name}`;
      const c = this;

      if (this.media.artist && !this.media.trackArtist) {
        key = `art-${this.media.artist.name}-${this.media.name}`;
      } else if (this.media.trackArtist) {
        key = `art-${this.media.trackArtist}-${this.media.album.name}`;
      }
      get(key).then((data: any) => {
        if (data) {
          c.setImage(data);
        } else {
          c.backgroundArtService.getMediaArt(c.media).subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            data => c.setImage(data),
            error => {
              c.el.style.backgroundImage = `url(${this.NOIMAGE})`;
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
    let dsm = localStorage.getItem("dsm");
    if (dsm) {
      dsm = dsm + "/data/image-proxy?url=";
    }
    if (!this.loaded || this.hasClassName("always-replace")) {
      if (data === this.NOIMAGE || data === "" || !data) {
        this.backgroundArtService.getMediaArtFromLastFm(this.media).subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          data => {
            if (data && data !== this.NOIMAGE) {
              this.el.style.backgroundImage = `url(${dsm}${encodeURIComponent(
                data
              )})`;
            } else {
              if (!data) {
                data = this.NOIMAGE;
              }
              this.el.style.backgroundImage = `url(${data})`;
            }

            const item = {
              _id: `art-${this.media.name}`,
              url: data
            };
            if (this.media.artist) {
              item._id = `art-${this.media.artist.name}-${this.media.name}`;
            }
            set(item._id, item.url);
          },
          error => (this.el.style.backgroundImage = `url(${this.NOIMAGE})`)
        );
      } else {
        this.el.style.backgroundImage = `url(${dsm}${encodeURIComponent(
          data
        )})`;

        const item = {
          _id: `art-${this.media.name}`,
          url: data
        };
        if (this.media.artist) {
          item._id = `art-${this.media.artist.name}-${this.media.name}`;
        }
        set(item._id, item.url);
      }
      this.loading = false;
      this.toggleLoaded(true);
    }
  }
  getPosition() {
    const box = this.el.getBoundingClientRect();
    const top =
      box.top + (window.pageYOffset - document.documentElement.clientTop);
    return {
      top: top,
      left:
        box.left + (window.pageXOffset - document.documentElement.clientLeft),
      bottom: top + this.el.clientHeight
    };
  }
  getLoadingContainer() {
    return this.el;
  }
  hasClassName(name: string) {
    return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(
      this.getLoadingContainer().className
    );
  }
  addClassName(name: string) {
    if (!this.hasClassName(name)) {
      const container = this.getLoadingContainer();
      container.className = container.className
        ? [container.className, name].join(" ")
        : name;
    }
  }
  removeClassName(name: string) {
    if (this.hasClassName(name)) {
      const container = this.getLoadingContainer();
      const c = container.className;
      container.className = c.replace(
        new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"),
        ""
      );
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
