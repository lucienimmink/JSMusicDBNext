import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from "@angular/core";

import { ConfigService } from './../utils/config.service';
import { Subscription } from 'rxjs/Subscription';

import { Sort } from './sort';

@Component({
    selector: 'sort',
    templateUrl: 'app/utils/sort.component.html',
    styleUrls: ['dist/utils/sort.component.css']
})
export class SortComponent implements OnInit {
    @Input() sorting: Array<string>;
    @Output() onSortChange = new EventEmitter<string>();
    private sort: Sort;
    private theme: string;
    private subscription: Subscription;

    constructor(private configService: ConfigService) {
        this.sort = new Sort();

        this.subscription = this.configService.theme$.subscribe(
            data => {
                this.theme = data;
            }
        )
        this.theme = configService.theme;
    }

    ngOnInit() {
        this.sort.sort = this.sorting[0];
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onChange() {
        // emit the change to the parent
        this.onSortChange.emit(this.sort.sort);
    }
}