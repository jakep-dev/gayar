import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { GaugeChartData, ComponentPrintSettings } from 'app/model/model';
import { BaseChart } from '../base-chart';

@Component({
  selector: 'gauge-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GaugeChartComponent extends BaseChart implements OnInit {

    @Input() chartData: GaugeChartData;

    @Input() printSettings: ComponentPrintSettings;
    
    constructor() {
        super();
        this.setDefaultChartType('solidgauge');
        this.hasRedrawActions = false;
    }

    ngOnInit() {
        this.initializeBarChart();
    }

    ngDoCheck() {
        if(!this.printSettings) {
            if(this.chart) { 
                this.chart.reflow(); 
            }     
        }
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
        let isPrintMode: boolean;
        
        if (this.chartData && this.chartData.series.length > 0
            && this.chartData.series.data !== null 
            && this.chartData.customChartSettings !== null) {

            isPrintMode = this.printSettings != null ? true : false;
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
                    },
                    false,
                    isPrintMode
                );
            }

            if (this.chartData.customChartSettings) {
                if(isPrintMode) {
                    this.applyPrintSettings(this.chartData.customChartSettings);
                }
                this.chart.update(this.chartData.customChartSettings, true);
            } else {
                if(isPrintMode) {
                    this.applyPrintSettings(this.chartOptions);
                }
                this.chart.update(this.chartOptions, true);
            }
        }
    }

    applyPrintSettings(chartOptions : any) {
        chartOptions.chart.width = this.printSettings.width;
        chartOptions.chart.height = this.printSettings.height;
        chartOptions.chart.animation = false;

        if(chartOptions.plotOptions) {
            if(chartOptions.plotOptions.series) {
                chartOptions.plotOptions.series.animation = false;
            } else {
                chartOptions.plotOptions.series = {
                    animation : false
                };
            }
        } else {
            chartOptions.plotOptions = {
                series: {
                    animation: false
                }
            };
        }
    }

    setChart(chart: any) {
        this.chart = chart;
        this.loadBarChartData();
    }

    hasRedrawActions: boolean;

    @Output() onChartRedraw = new EventEmitter<BaseChart>();
    
    onRedraw(chart: BaseChart) {
        this.onChartRedraw.emit(this);
        this.hasRedrawActions = false;
    }

}
