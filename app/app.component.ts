
import { Component, OnInit } from "@angular/core";
import { musicdbcore } from './org/arielext/musicdb/core';
import { Observable } from 'rxjs/Observable';

import { CollectionService } from './collection.service';
// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';


@Component({
  selector: 'musicdb',
  templateUrl: 'app/app.component.html',
  providers: [ CollectionService ]
})
export class AppComponent implements OnInit {
  private letters:Array<any>;
  constructor (private collectionService: CollectionService) {}

  ngOnInit() {
    this.getCollection();
  }

  getCollection() {
    this.collectionService.getCollection()
      .subscribe(
        data => this.fillCollection(data),
        error => console.log(error)
      );
  }
  fillCollection(data:any):void {
    let core = new musicdbcore();
    core.parseSourceJson(data);
    let lettersObject = core.letters;
    let sorted = Object.keys(lettersObject).sort(function (a,b) {
      return (a < b) ? -1 : 1;
    });
    let t = [];
    sorted.forEach(function (value, index) {
      t.push(lettersObject[value]);
    });
    this.letters = t;
  }
}