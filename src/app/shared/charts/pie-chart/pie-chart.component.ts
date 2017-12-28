import {BaseChart} from '../base-chart';
import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { PieChartData, ComponentPrintSettings } from 'app/model/model';

@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PieChartComponent extends BaseChart implements OnInit {

  @Input() chartData: PieChartData;

  @Input() printSettings: ComponentPrintSettings;

  onDrilldown: any = null;
  onDrillup: any = null;
    constructor() {
        super();
        this.setDefaultChartType('pie');
        this.hasRedrawActions = false;  
    }

    ngOnInit() {
        this.initializePieChart();
    }plot

    ngDoCheck() { 
        if(!this.printSettings) {
            if(this.chart) { 
                this.chart.reflow(); 
            }
        }
    }

    /**
     * Initialze simple Piechart settings that doens't require the underlying HighChart chart object
     */
    initializePieChart() {

        this.setTitle(this.chartData.title);
        this.setSubTitle(this.chartData.subtitle);
        this.setXAxisTitle(this.chartData.xAxisLabel);
        this.setYAxisTitle(this.chartData.yAxisLabel);
        this.hasRedrawActions = this.chartData.hasRedrawActions;

        if (this.chartData.drilldownUpText) { 
            this.setDrillUpText(this.chartData.drilldownUpText); 
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
        
        if (this.chartData.onDrillUp) {
            this.onDrillup = this.chartData.onDrillUp;
        }

    }

    /**
     * Load PieChart settings and data that requires the underlying HighChart chart object
     */
    loadPieChartData() {
        let seriesIndex: number;
        let seriesLength: number;

        if (this.chartData) {
            let isPrintMode: boolean = this.printSettings != null ? true : false;

            //clear out old series before adding new series data
            seriesLength = this.chart.series.length;

            for (seriesIndex = seriesLength - 1; seriesIndex >= 0; seriesIndex--) {
                this.chart.series[seriesIndex].remove();
            }
            //add in new series data
            seriesLength = this.chartData.series.length;
            for (seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++) {
                this.chart.addSeries(
                    {
                        id: this.chartData.series[seriesIndex].name,
                        name: this.chartData.series[seriesIndex].name,
                        type: 'pie',
                        data: this.chartData.series[seriesIndex].data
                    },
                    false,
                    isPrintMode
                );
            }

            if (this.chartData.onDrillDown) {
                this.onDrilldown = this.chartData.onDrillDown;
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
        this.loadPieChartData();
    }

    hasRedrawActions: boolean;

    @Output() onChartRedraw = new EventEmitter<BaseChart>();
    
    onRedraw(chart: BaseChart) {
        this.onChartRedraw.emit(this);
        this.hasRedrawActions = false;
    }

}
