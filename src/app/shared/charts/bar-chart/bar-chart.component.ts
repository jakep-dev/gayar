import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { BarChartData, ComponentPrintSettings } from 'app/model/model';
import { BaseChart } from '../base-chart';

@Component({
    selector: 'bar-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BarChartComponent extends BaseChart implements OnInit {

    @Input() chartData: BarChartData;

    @Input() printSettings: ComponentPrintSettings;

    onDrilldown: any = null;
    onDrillup: any = null;

    constructor() {
        super();
        this.setDefaultChartType('column');
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
        
        if (this.chartData.drillUpText) {
            this.setDrillUpText(this.chartData.drillUpText);
        }

        if (this.chartData.customChartSettings.drilldown) {
            this.chartOptions.drilldown = this.chartData.customChartSettings.drilldown;
            if(this.printSettings) {
                if(this.chartOptions.drilldown) {
                    if(this.chartOptions.drilldown.drillUpButton) {
                        if(this.chartOptions.drilldown.drillUpButton.theme) {
                            this.chartOptions.drilldown.drillUpButton.theme['stroke-width'] = 0;
                            this.chartOptions.drilldown.drillUpButton.theme.style = { 
                                color: 'white'
                            };
                        }
                    }
                }
            }
        }

        if (this.chartData.customChartSettings &&
            this.chartData.customChartSettings.yAxis && 
            this.chartData.customChartSettings.yAxis.length) {
            this.chartOptions.yAxis = this.chartData.customChartSettings.yAxis;
        }

        if (this.chartData.customChartSettings &&
            this.chartData.customChartSettings.xAxis && 
            this.chartData.customChartSettings.xAxis.length) {
            this.chartOptions.xAxis = this.chartData.customChartSettings.xAxis;
        }
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
                            type: this.chartData.series[seriesIndex].type || 'column',
                            color: this.chartData.series[seriesIndex].color,
                            data: this.chartData.series[seriesIndex].data,
                            pointWidth: this.chartData.series[seriesIndex].pointWidth,
                            borderWidth: this.chartData.series[seriesIndex].borderWidth,
                            pointPlacement: this.chartData.series[seriesIndex].pointPlacement,
                            showInLegend: this.chartData.series[seriesIndex].showInLegend,  
                            marker: this.chartData.series[seriesIndex].marker
                        },
                        false,
                        isPrintMode
                    );
                }
            }

            if (this.chartData.onDrillDown) {
                this.onDrilldown = this.chartData.onDrillDown;
            }

            if (this.chartData.onDrillUp) {
                this.onDrillup = this.chartData.onDrillUp;
            }
            
            if(this.chartData.customChartSettings) {
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
    }
    
}
