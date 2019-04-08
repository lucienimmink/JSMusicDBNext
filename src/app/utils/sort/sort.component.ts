import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
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
  @Input() public sorting: any[];
  @Output() public onSortChange = new EventEmitter<string>();
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

  public ngOnInit() {
    this.sort.sort = this.sorting[0].value;
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public onChange(e: Event) {
    // emit the change to the parent
    this.onSortChange.emit(this.sort.sort);
  }
}
