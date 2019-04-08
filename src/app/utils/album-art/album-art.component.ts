declare const window: any;

import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit } from "@angular/core";
import { get, set } from "idb-keyval";
import { Subscription } from "rxjs";

import Album from "./../../org/arielext/musicdb/models/Album";
import Track from "./../../org/arielext/musicdb/models/Track";
import { AlbumArtService } from "./../album-art.service";
import { ColorService } from "./../color.service";
import { addCustomCss, getColorsFromRGB, getDominantColor } from "./../colorutil";
import { AlbumArt } from "./album-art";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "mdb-album-art",
  templateUrl: "./album-art.component.html",
  providers: [AlbumArtService]
})
export class AlbumArtComponent implements OnInit, OnChanges, OnDestroy {
  public albumart: AlbumArt = new AlbumArt();

  @Input() public album: Album;
  @Input() public track: Track;
  @Input("dynamic-accent-color") public dynamicAccentColor: boolean = false;
  private subscription: Subscription;

  private searchArtist: string;
  private searchAlbum: string;
  private searchType = "album";
  private NOIMAGE = "global/images/no-cover.png";
  private hasEvent: boolean = false;

  constructor(private albumArtService: AlbumArtService, private elementRef: ElementRef, private colorService: ColorService) {
    this.albumart.name = "Unknown album";
    this.albumart.url = this.NOIMAGE;
    this.subscription = this.colorService.blob$.subscribe(() => {
      const blob = new Blob([window.externalBlob], { type: "image/png" });
      // build a url from the blob
      const objectURL = URL.createObjectURL(blob);
      const image = new Image();
      image.src = objectURL;
      // now let's set that color!
      getDominantColor(
        image,
        rgba => {
          const colors = getColorsFromRGB(rgba);
          this.colorService.setColor(colors.rgba);
          addCustomCss(colors);
        },
        true
      );
    });
  }
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  public ngOnInit() {
    let key = "";
    if (this.album) {
      // album
      this.albumart.name = this.album.name;
      this.searchArtist = this.album.artist.albumArtist || this.album.artist.name;
      this.searchAlbum = this.album.name;
      key = `art-${this.searchArtist}-${this.searchAlbum}`;
    } else {
      // track
      this.albumart.name = this.track.album.name;
      this.searchArtist = this.track.trackArtist;
      this.searchAlbum = this.track.album.name;
      if (this.track.album.artist.isCollection) {
        this.searchType = "artist";
        key = `art-${this.searchArtist}`;
      } else {
        this.searchType = "album";
        key = `art-${this.searchArtist}-${this.searchAlbum}`;
      }
    }

    get(key).then((data: any) => {
      if (data) {
        this.setImage(data);
      } else {
        this.albumArtService.getAlbumArt(this.searchArtist, this.searchAlbum, this.searchType).subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          data => this.setImage(data),
          error => (this.albumart.url = this.NOIMAGE)
        );
      }
    });
    if (this.dynamicAccentColor && !this.hasEvent) {
      // add loader to this.elementRef if not present
      // onload = colorthief
      // then save custom color using colorutil

      this.elementRef.nativeElement.childNodes[0].addEventListener(
        "load",
        function() {
          getDominantColor(
            this,
            rgba => {
              const colors = getColorsFromRGB(rgba);
              this.colorService.setColor(colors.rgba);
              addCustomCss(colors);
            },
            false
          );
        },
        { passive: true }
      );
      this.hasEvent = true;
    }
  }

  public ngOnChanges(changes) {
    this.ngOnInit();
  }
  public setImage(data: any) {
    let dsm = localStorage.getItem("dsm");
    if (dsm) {
      dsm = dsm + "/data/image-proxy?url=";
    }
    if (data === "global/images/no-cover.png" || data === "" || !data) {
      this.albumArtService.getMediaArtFromLastFm(this.searchArtist, this.searchAlbum, this.searchType).subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        data => {
          data = this.albumArtService.returnImageUrlFromLastFMResponse(data);
          // TODO: perhaps we'd like to store the complete object in the future to have the ability to load smaller images over a metered line
          if (data instanceof Object) {
            data = this.NOIMAGE;
          }
          if (data && data !== "global/images/no-cover.png") {
            this.albumart.url = `${dsm}${encodeURIComponent(data)}`;
          } else {
            if (!data) {
              data = this.NOIMAGE;
            }
            this.albumart.url = data;
          }
          const item = {
            _id: `art-${this.searchArtist}-${this.searchAlbum}`,
            url: data || this.NOIMAGE
          };
          set(item._id, item.url);
        },
        error => (this.albumart.url = this.NOIMAGE)
      );
    } else {
      data = this.albumArtService.returnImageUrlFromLastFMResponse(data);
      // TODO: perhaps we'd like to store the complete object in the future to have the ability to load smaller images over a metered line
      if (data instanceof Object) {
        data = this.NOIMAGE;
        this.albumart.url = this.NOIMAGE;
      } else {
        this.albumart.url = `${dsm}${encodeURIComponent(data)}`;
      }
      const item = {
        _id: `art-${this.searchArtist}-${this.searchAlbum}`,
        url: data || this.NOIMAGE
      };
      set(item._id, item.url);
    }
  }
}
