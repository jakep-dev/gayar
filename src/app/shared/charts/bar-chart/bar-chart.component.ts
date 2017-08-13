import { Component, OnInit, Input } from '@angular/core';
import {  ChartData } from 'app/model/model';
import { BaseChartComponent } from '../base-chart/base-chart.component';

@Component({
    selector: 'bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends BaseChartComponent implements OnInit {

    @Input('chartData') set setChartData(data: ChartData) {
        if(data) {
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
                        data: data.series[i].data
                    }
                );
            }
            this.chartOptions.xAxis.categories = data.categories;
            this.chartOptions.xAxis.labels.formatter = data.xAxisFormatter;
            this.setTitle(data.title);
            this.setSubTitle(data.subtitle);
            this.setXAxisTitle(data.xAxisLabel);
            this.setYAxisTitle(data.yAxisLabel);
            this.chart.update(this.chartOptions, true);
        }
    }

    constructor() {
        super();
        this.setDefaultChartType('column');
    }

    ngOnInit() {}

    setChart(chart) {
        this.chart = chart;
    }

}
