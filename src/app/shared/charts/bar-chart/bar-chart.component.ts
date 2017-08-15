import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { BarChartData } from 'app/model/model';
import { BaseChartComponent } from '../base-chart/base-chart.component';

@Component({
    selector: 'bar-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent extends BaseChartComponent implements OnInit {

    @Input('chartData') set setChartData(data: BarChartData) {
        //Check to see if we have at least one data point
        if(data && data.categories.length > 0 && data.series.length > 0) {
            //update simple settings
            this.chartOptions.xAxis.categories = data.categories;
            this.chartOptions.xAxis.labels.formatter = data.xAxisFormatter;
            this.setTitle(data.title);
            this.setSubTitle(data.subtitle);
            this.setXAxisTitle(data.xAxisLabel);
            this.setYAxisTitle(data.yAxisLabel);
            //update chart but don't redraw chart yet
            this.chart.update(this.chartOptions, false);

            let i: number;
            let n1: number;
            //clear out old series before adding new series data
            n1 = this.chart.series.length;
            for(i =  n1 -1; i >= 0; i--) {
                this.chart.series[i].remove();
            }
            //add in new series data
            n1 = data.series.length;
            for (i = 0; i < n1; i++) {
                this.chart.addSeries(
                    {
                        id: data.series[i].name,
                        name: data.series[i].name,
                        type: 'column',
                        color: data.series[i].color,
                        data: data.series[i].data,
                        pointWidth: data.series[i].pointWidth,
                        borderWidth: data.series[i].borderWidth,
                        pointPlacement: data.series[i].pointPlacement
                    }
                );
            }
            this.hasRedrawActions = data.hasRedrawActions;
            if(data.customChartSettings) {
                this.chart.update(data.customChartSettings, true);
            } else {
                this.chart.update(this.chartOptions, true);
            }
        }
    }

    constructor() {
        super();
        this.setDefaultChartType('column');
        this.hasRedrawActions = false;
    }

    ngOnInit() {}

    setChart(chart: any) {
        this.chart = chart;
    }

    hasRedrawActions: boolean;

    @Output() onChartRedraw = new EventEmitter<any>();

    onRedraw(chart: any) {
        if(this.hasRedrawActions) {
            this.onChartRedraw.emit(chart);
            this.hasRedrawActions = false;
        }
    }
}
