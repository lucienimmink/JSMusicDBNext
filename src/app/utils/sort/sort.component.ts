import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { Subscription } from "rxjs";

import { ConfigService } from "./../config.service";
import { Sort } from "./sort";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "mdb-sort",
  templateUrl: "./sort.component.html"
})
export class SortComponent implements OnInit, OnDestroy {
  @Input() sorting: Array<any>;
  @Output() onSortChange = new EventEmitter<string>();
  public sort: Sort;
  public theme: string;
  private subscription: Subscription;

  constructor(private configService: ConfigService) {
    this.sort = new Sort();

    this.subscription = this.configService.mode$.subscribe(data => {
      this.theme = data;
    });
    this.theme = configService.mode;
  }

  ngOnInit() {
    this.sort.sort = this.sorting[0].value;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChange(e: Event) {
    // emit the change to the parent
    this.onSortChange.emit(this.sort.sort);
  }
}
