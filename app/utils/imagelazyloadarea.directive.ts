import {Directive, Query, QueryList, Input, ElementRef, Renderer, forwardRef, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

import {BackgroundArtDirective} from './backgroundart.directive';
import {ArtistComponent} from './../artist/artist.component';
import {AlbumComponent} from './../album/album.component';

@Directive({
  selector: '[imageLazyLoadArea]'
})
export class ImageLazyLoadAreaDirective implements OnInit {
  @Input('imageLazyLoadArea') threshold: number;
  private items: QueryList<ArtistComponent>;
  private itemsAlbum: QueryList<AlbumComponent>;
  private itemsToLoad: Array<any>;
  private itemsToLoadAlbum: Array<any>;

  private scrollSubscription: Subscription;
  private scrollSubscriptionAlbum: Subscription;

  constructor(@Query(forwardRef(() => ArtistComponent), {descendants: true}) items: QueryList<ArtistComponent>, @Query(forwardRef(() => AlbumComponent), {descendants: true}) itemsAlbum: QueryList<AlbumComponent>) {
    this.items = items;
    this.itemsAlbum = itemsAlbum;
  }
  loadInView(list?:Array<BackgroundArtDirective>):void {
    this.itemsToLoad = (list || this.itemsToLoad).filter((item) => !item.loaded && !item.loading);
    for (let item of this.itemsToLoad) {
      let ePos = item.backgroundArt.getPosition();
      if (ePos.bottom > 0 && (ePos.bottom >= (window.pageYOffset - this.threshold)) && (ePos.top <= ((window.pageYOffset + window.innerHeight) + this.threshold))) {
        item.backgroundArt.loadImage();
      }
    }
    if (this.itemsToLoad.length === 0) {
      // subscription is no longer needed
      if (this.scrollSubscription) {
        this.scrollSubscription.unsubscribe();
        this.scrollSubscription = undefined;
      }
    }
  }

  loadInViewAlbum(list?:Array<BackgroundArtDirective>):void {
    this.itemsToLoadAlbum = (list || this.itemsToLoadAlbum).filter((item) => !item.loaded && !item.loading);
    for (let item of this.itemsToLoadAlbum) {
      let ePos = item.backgroundArt.getPosition();
      if (ePos.bottom > 0 && (ePos.bottom >= (window.pageYOffset - this.threshold)) && (ePos.top <= ((window.pageYOffset + window.innerHeight) + this.threshold))) {
        item.backgroundArt.loadImage();
      }
    }
    if (this.itemsToLoadAlbum.length === 0) {
      // subscription is no longer needed
      if (this.scrollSubscriptionAlbum) {
        this.scrollSubscriptionAlbum.unsubscribe();
        this.scrollSubscriptionAlbum = undefined;
      }
    }
  }

  scrollSubscribe() {
    let scrollStream = Observable.fromEvent(window, 'scroll').debounceTime(250);

    this.scrollSubscription = scrollStream.subscribe(() => {
      this.loadInView();
    });
  }

  scrollSubscribeAlbum() {
    let scrollStream = Observable.fromEvent(window, 'scroll').debounceTime(250);

    this.scrollSubscriptionAlbum = scrollStream.subscribe(() => {
      this.loadInViewAlbum();
    });
  }


  ngOnInit() {
    this.threshold = +this.threshold || 100;

    this.items.changes.subscribe((list) => {
      this.loadInView(list.toArray());
      if (!this.scrollSubscription) {
        this.scrollSubscribe();
      }
    });

    this.itemsAlbum.changes.subscribe((list) => {
      this.loadInViewAlbum(list.toArray());
      if (!this.scrollSubscriptionAlbum) {
        this.scrollSubscribeAlbum();
      }
    });
  }
}

export const IMAGELAZYLOAD_DIRECTIVE:any [] = [ImageLazyLoadAreaDirective];