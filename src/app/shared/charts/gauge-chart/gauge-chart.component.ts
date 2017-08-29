import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { GaugeChartData } from 'app/model/model';
import { BaseChart } from '../base-chart';

@Component({
  selector: 'gauge-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})

export class GaugeChartComponent extends BaseChart implements OnInit {

    @Input() chartData: GaugeChartData;

    constructor() {
        super();
        this.setDefaultChartType('solidgauge');
        this.hasRedrawActions = false;
    }

    ngOnInit() {
        this.initializeBarChart();
    }

    /**
     * Initialze simple barchart settings that doens't require the underlying HighChart chart object
     */
    initializeBarChart() {
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
        
        if (this.chartData && this.chartData.series.length > 0
            && this.chartData.series.data !== null 
            && this.chartData.customChartSettings !== null) {

            //clear out old series before adding new series data
            seriesLength = this.chart.series.length;
            for (seriesIndex = seriesLength - 1; seriesIndex >= 0; seriesIndex--) {
                this.chart.series[seriesIndex].remove();
            }
            //add in new series data
            seriesLength = this.chartData.customChartSettings.series.length;

            for (seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++) {
                this.chart.addSeries(
                    {
                        id: this.chartData.series[seriesIndex].name,
                        name: this.chartData.series[seriesIndex].name,
                        type: 'solidgauge',
                        data: this.chartData.series[seriesIndex].data,
                        pane: this.chartData.customChartSettings.pane
                    }
                );
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
