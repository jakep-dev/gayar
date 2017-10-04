import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { BoxPlotChartData } from 'app/model/model';
import { BaseChart } from '../base-chart';

@Component({
    selector: 'boxplot-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './boxplot-chart.component.html',
    styleUrls: ['./boxplot-chart.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BoxPlotChartComponent extends BaseChart implements OnInit {

    @Input() chartData: BoxPlotChartData;

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
        if (this.chartData) {
            if(this.chartData.series.length > 0) {
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
                            type: 'boxplot',
                            data: this.chartData.series[seriesIndex].data,
                            pointWidth: this.chartData.series[seriesIndex].pointWidth,
                            whiskerLength: this.chartData.series[seriesIndex].whiskerLength
                        }
                    );
                }
            }
            if (this.chartData.customChartSettings) {
                this.chart.update(this.chartData.customChartSettings, true);
            } else {
                this.chart.update(this.chartOptions, true);
            }
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
