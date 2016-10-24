import { Component, Input } from "@angular/core";

@Component({
    selector: 'sort',
    templateUrl: 'app/utils/sort.component.html',
    styleUrls: ['dist/utils/sort.component.css']
})
export class SortComponent {
    @Input() sorting: Array<string>;

    constructor() {
    }
}