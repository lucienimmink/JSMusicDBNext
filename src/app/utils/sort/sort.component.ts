import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs/Subscription';

import { ConfigService } from './../config.service';
import { Sort } from './sort';

@Component({
  selector: 'mdb-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent implements OnInit {
  @Input() sorting: Array<any>;
  @Output() onSortChange = new EventEmitter<string>();
  public sort: Sort;
  public theme: string;
  private subscription: Subscription;

  constructor(private configService: ConfigService) {
    this.sort = new Sort();

    this.subscription = this.configService.mode$.subscribe(
      data => {
        this.theme = data;
      }
    )
    this.theme = configService.mode;
  }

  ngOnInit() {
    this.sort.sort = this.sorting[0].value;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChange(e:Event) {
    // emit the change to the parent
    this.onSortChange.emit(this.sort.sort);
  }
}