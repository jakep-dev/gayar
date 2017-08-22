import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { BoxPlotChartData } from 'app/model/model';
import { BaseChart } from '../base-chart';

@Component({
    selector: 'boxplot-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './boxplot-chart.component.html',
    styleUrls: ['./boxplot-chart.component.scss'],
})
export class BoxPlotChartComponent extends BaseChart implements OnInit {

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

            let seriesIndex: number;
            let seriesLength: number;
            //clear out old series before adding new series data
            seriesLength = this.chart.series.length;
            for(seriesIndex =  seriesLength -1; seriesIndex >= 0; seriesIndex--) {
                this.chart.series[seriesIndex].remove();
            }
            //add in new series data
            seriesLength = data.series.length;
            for (seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++) {
                this.chart.addSeries(
                    {
                        id: data.series[seriesIndex].name,
                        name: data.series[seriesIndex].name,
                        type: 'boxplot',
                        data: data.series[seriesIndex].data,
                        pointWidth: data.series[seriesIndex].pointWidth,
                        whiskerLength: data.series[seriesIndex].whiskerLength
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
