import { Directive, ElementRef, Input } from "@angular/core";
import { get, set } from "idb-keyval";
import { BackgroundArtService } from "./background-art.service";

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: "[mdb-BackgroundArt]",
  providers: [BackgroundArtService]
})
export class BackgroundArtDirective {
  public NOIMAGE = "global/images/no-cover.png";
  public loading = false;
  public loaded = false;
  public error = false;

  // tslint:disable-next-line:no-input-rename
  @Input("mdb-BackgroundArt") public media: any;

  private el: HTMLElement;
  private loadingClass = "loading";
  private loadedClass = "loaded";
  private errorClass = "error";

  constructor(el: ElementRef, private backgroundArtService: BackgroundArtService) {
    this.el = el.nativeElement;
    // this.loadImage(); // always load image
    setTimeout(() => {
      this.loadImage();
    }, 100);
  }
  public loadImage() {
    if ((!this.loaded && !this.loading) || this.hasClassName("always-replace")) {
      this.loading = true;
      this.addClassName(this.loadingClass);

      let key = `art-${this.media.name}`;
      if (this.media.artist && !this.media.trackArtist) {
        key = `art-${this.media.artist.name}-${this.media.name}`;
      } else if (this.media.trackArtist) {
        key = `art-${this.media.trackArtist}-${this.media.album.name}`;
      }
      get(key).then((data: any) => {
        if (data) {
          this.setImage(data);
        } else {
          this.backgroundArtService.getMediaArt(this.media).subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            data => this.setImage(data),
            error => {
              this.el.style.backgroundImage = `url(${this.NOIMAGE})`;
              this.error = true;
              this.loading = false;
              this.removeClassName(this.loadingClass);
              this.addClassName(this.errorClass);
            }
          );
        }
      });
    }
  }
  public setImage(data: any) {
    let dsm = localStorage.getItem("dsm");
    if (dsm) {
      dsm = dsm + "/data/image-proxy?url=";
    }
    if (!this.loaded || this.hasClassName("always-replace")) {
      if (data === this.NOIMAGE || data === "" || !data) {
        this.backgroundArtService.getMediaArtFromLastFm(this.media).subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          data => {
            data = this.backgroundArtService.returnImageUrlFromLastFMResponse(data);
            if (data && data !== this.NOIMAGE) {
              this.el.style.backgroundImage = `url(${dsm}${encodeURIComponent(data)})`;
            } else {
              if (!data) {
                data = this.NOIMAGE;
              }
              this.el.style.backgroundImage = `url(${data})`;
            }

            const item = {
              _id: `art-${this.media.name}`,
              url: data || this.NOIMAGE
            };
            if (this.media.artist) {
              item._id = `art-${this.media.artist.name}-${this.media.name}`;
            }
            set(item._id, item.url);
          },
          error => (this.el.style.backgroundImage = `url(${this.NOIMAGE})`)
        );
      } else {
        data = this.backgroundArtService.returnImageUrlFromLastFMResponse(data);
        if (data) {
          const imageUrl = (this.el.style.backgroundImage = `url(${dsm}${encodeURIComponent(data)})`);
        } else {
          const imageUrl = (this.el.style.backgroundImage = `url(${this.NOIMAGE})`);
        }

        const item = {
          _id: `art-${this.media.name}`,
          url: data || this.NOIMAGE
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
  public getPosition() {
    const box = this.el.getBoundingClientRect();
    const top = box.top + (window.pageYOffset - document.documentElement.clientTop);
    return {
      top,
      left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
      bottom: top + this.el.clientHeight
    };
  }
  public getLoadingContainer() {
    return this.el;
  }
  public hasClassName(name: string) {
    return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.getLoadingContainer().className);
  }
  public addClassName(name: string) {
    if (!this.hasClassName(name)) {
      const container = this.getLoadingContainer();
      container.className = container.className ? [container.className, name].join(" ") : name;
    }
  }
  public removeClassName(name: string) {
    if (this.hasClassName(name)) {
      const container = this.getLoadingContainer();
      const c = container.className;
      container.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
    }
  }
  public toggleLoaded(enable: boolean) {
    this.loaded = enable;
    if (enable) {
      this.removeClassName(this.loadingClass);
      this.addClassName(this.loadedClass);
    } else {
      this.removeClassName(this.loadedClass);
    }
  }
}
