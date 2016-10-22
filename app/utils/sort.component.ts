import { Component, Input } from "@angular/core";

@Component({
    selector: 'sort',
    templateUrl: 'app/utils/sort.component.html',
    styleUrls: ['dist/utils/sort.component.css']
})
export class SortComponent {
    public albumart: any = {}
    @Input() sort: Array<string>;

    constructor() {
    }
}