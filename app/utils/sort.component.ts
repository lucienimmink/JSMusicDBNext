import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
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

    constructor() {
        this.sort = new Sort();
    }

    ngOnInit() {
        this.sort.sort = this.sorting[0];
    }

    onChange() {
        // emit the change to the parent
        this.onSortChange.emit(this.sort.sort);
    }
}