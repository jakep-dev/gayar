import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { GaugeChartData } from 'app/model/model';
import { BaseChart } from '../base-chart';

@Component({
  selector: 'gauge-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})

export class GaugeChartComponent extends BaseChart implements OnInit {

    @Input('chartData') set setChartData(data: GaugeChartData) {
        //Check to see if we have at least one data point

        if(data && data.series.length > 0 && data.customChartSettings !== null) {
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
            seriesLength = data.customChartSettings.series.length;
            for (seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++) {
                this.chart.addSeries(
                    {
                        id: data.series[seriesIndex].name,
                        name: data.series[seriesIndex].name,
                        type: 'solidgauge',
                        data: data.series[seriesIndex].data,
                        pane: data.customChartSettings.pane
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
        this.setDefaultChartType('solidgauge');
        this.hasRedrawActions = false;
        //this.onRedraw(this.chart);
    }

    ngOnInit() {}

    setChart(chart: any) {
        this.chart = chart;
    }

    hasRedrawActions: boolean;

    @Output() onChartRedraw = new EventEmitter<any>();

    //@HostListener("redraw", ["$event"]) 
    onRedraw(chart: any) {
        if(this.hasRedrawActions) {
            this.onChartRedraw.emit(chart);
            this.hasRedrawActions = false;
        }
    }
}
