import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { BoxPlotChartData, ComponentPrintSettings } from 'app/model/model';
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

    @Input() printSettings: ComponentPrintSettings;

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
            let isPrintMode: boolean = this.printSettings != null ? true : false;
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
                        },
                        false,
                        isPrintMode
                    );
                }
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
        //if(this.hasRedrawActions) {
        this.renderedObject.forEach(object => {
            object.destroy(); 
        });
        this.renderedObject = [];
        this.onChartRedraw.emit(this);
        this.hasRedrawActions = false;
        //}
    }
    
}
