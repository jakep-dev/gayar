import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-simple-table',
    templateUrl: './simple-table.component.html',
    styleUrls: ['./simple-table.component.scss']
})

export class SimpleTableComponent implements OnInit {
    @Input() headerColumns: Array<String>;
    @Input() columnsKeys: Array<String>;
    @Input() columnsHAlignment: Array<String>;
    @Input() columnsWidth: Array<String>;
    @Input() dataSource: Array<any>;

    constructor() { }

    ngOnInit() {
    }
}
