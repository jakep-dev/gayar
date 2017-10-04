import {BaseChart} from '../base-chart';
import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { PieChartData } from 'app/model/model';

@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PieChartComponent extends BaseChart implements OnInit {

  @Input() chartData: PieChartData;
  onDrilldown: any = null;

    constructor() {
        super();
        this.setDefaultChartType('pie');
        this.hasRedrawActions = false;
    }

    ngOnInit() {
        this.initializePieChart();
    }plot

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
        }         
    }

    /**
     * Load PieChart settings and data that requires the underlying HighChart chart object
     */
    loadPieChartData() {
        let seriesIndex: number;
        let seriesLength: number;

        if (this.chartData) {

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
                    }
                );
            }

            if (this.chartData.onDrillDown) {
                this.onDrilldown = this.chartData.onDrillDown;
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
        this.loadPieChartData();
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
