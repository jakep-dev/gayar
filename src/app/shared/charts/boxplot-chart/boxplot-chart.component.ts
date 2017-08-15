import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { BoxPlotChartData } from 'app/model/model';
import { BaseChartComponent } from '../base-chart/base-chart.component';

@Component({
    selector: 'boxplot-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './boxplot-chart.component.html',
    styleUrls: ['./boxplot-chart.component.scss'],
})
export class BoxPlotChartComponent extends BaseChartComponent implements OnInit {

    @Input('chartData') set setChartData(data: BoxPlotChartData) {
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
                        type: 'boxplot',
                        data: data.series[i].data,
                        pointWidth: data.series[i].pointWidth,
                        whiskerLength: data.series[i].whiskerLength
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
        this.setDefaultChartType('boxplot');
        this.chartOptions.plotOptions = {
            boxplot: {
                colorByPoint: false,
                fillColor: '#ffffff',
                color: '#464646',
                medianColor: '#000000',
                medianWidth: 2,
                lineWidth: 2
            }
        };
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
