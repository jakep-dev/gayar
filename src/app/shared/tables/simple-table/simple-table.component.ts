import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-simple-table',
    templateUrl: './simple-table.component.html',
    styleUrls: ['./simple-table.component.scss']
})

export class SimpleTableComponent implements OnInit {
    @Input() hearderColumns: Array<String>;
    @Input() columnsKeys: Array<String>;
    @Input() dataSource: Array<any>;

    constructor() { }

    ngOnInit() {
    }
}
