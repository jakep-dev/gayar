import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { BarChartData } from 'app/model/model';
import { BaseChart } from '../base-chart';

@Component({
    selector: 'bar-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent extends BaseChart implements OnInit {

    @Input() chartData: BarChartData;

    constructor() {
        super();
        this.setDefaultChartType('column');
        this.hasRedrawActions = false;
    }

    ngOnInit() {
        this.initializeBarChart();
    }

    /**
     * Initialze simple barchart settings that doens't require the underlying HighChart chart object
     */
    initializeBarChart() {
        //update simple settings
        this.chartOptions.xAxis.categories = this.chartData.categories;
        this.chartOptions.xAxis.labels.formatter = this.chartData.xAxisFormatter;
        this.setTitle(this.chartData.title);
        this.setSubTitle(this.chartData.subtitle);
        this.setXAxisTitle(this.chartData.xAxisLabel);
        this.setYAxisTitle(this.chartData.yAxisLabel);
        this.hasRedrawActions = this.chartData.hasRedrawActions;
    }

    /**
     * Load barchart settings and data that requires the underlying HighChart chart object
     */
    loadBarChartData() {
        let seriesIndex: number;
        let seriesLength: number;
        //clear out old series before adding new series data
        seriesLength = this.chart.series.length;
        for(seriesIndex =  seriesLength -1; seriesIndex >= 0; seriesIndex--) {
            this.chart.series[seriesIndex].remove();
        }
        //add in new series data
        seriesLength = this.chartData.series.length;
        for (seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++) {
            this.chart.addSeries(
                {
                    id: this.chartData.series[seriesIndex].name,
                    name: this.chartData.series[seriesIndex].name,
                    type: this.chartData.series[seriesIndex].type || 'column',
                    color: this.chartData.series[seriesIndex].color,
                    data: this.chartData.series[seriesIndex].data,
                    pointWidth: this.chartData.series[seriesIndex].pointWidth,
                    borderWidth: this.chartData.series[seriesIndex].borderWidth,
                    pointPlacement: this.chartData.series[seriesIndex].pointPlacement,
                    showInLegend: this.chartData.series[seriesIndex].showInLegend,  
                    marker: this.chartData.series[seriesIndex].marker
                }
            );
        }

        if(this.chartData.customChartSettings) {
            this.chart.update(this.chartData.customChartSettings, true);
        } else {
            this.chart.update(this.chartOptions, true);
        }
    }

    setChart(chart: any) {
        this.chart = chart;
        this.loadBarChartData();
    }

    hasRedrawActions: boolean;

    @Output() onChartRedraw = new EventEmitter<BaseChart>();

    onRedraw(chart: BaseChart) {
        if(this.hasRedrawActions) {
            this.onChartRedraw.emit(this);
            this.hasRedrawActions = false;
        }
    }
    
}
