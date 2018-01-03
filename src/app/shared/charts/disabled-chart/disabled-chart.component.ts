import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { BarChartData, ComponentPrintSettings } from 'app/model/model';
import { BaseChart } from '../base-chart';

@Component({
    selector: 'disabled-chart',
    templateUrl: './disabled-chart.component.html',
    styleUrls: ['./disabled-chart.component.scss']
})
export class DisabledChartComponent implements OnInit {
    
    ngOnInit() { }
}
