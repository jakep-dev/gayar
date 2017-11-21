import { BaseChart } from '../../base-chart';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { BarChartData } from 'app/model/model';

@Component({
    selector: 'bar-chart-logarithm',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './bar-chart-logarithm.component.html',
    styleUrls: ['./bar-chart-logarithm.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BarChartLogarithmComponent extends BaseChart implements OnInit {

    @Input() chartData: BarChartData;
    onDrilldown: any = null;
    onDrillup: any = null;
    breakLines: any = [];

    constructor() {
        super();
        this.setDefaultChartType('column');
        this.hasRedrawActions = false;
    }

    ngOnInit() {
        this.initializeBarChart();
    }
    
    ngDoCheck() {  
        if(this.chart) { 
            this.chart.reflow(); 
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
                        }
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
        this.addBreakLines();
        this.onChartRedraw.emit(this);
    }

    addBreakLines() {
        
        this.breakLines.forEach(line => {
            line.destroy();
        });
        this.breakLines = [];
            
        if(this.chart.yAxis[0].dataMax > 10) {
            let getYPosition = this.getYAxisPosition(10);
            let getMaxYPosition = this.getYAxisPosition(this.chart.yAxis[0].max)

            var redLine = this.chart.renderer.path([
                'M', this.chart.plotLeft, getYPosition - 5,
                'L', this.chart.plotLeft, getMaxYPosition
            ]).attr({
                stroke: '#ff0000',
                'stroke-width': 2,
                zIndex: 999
            })
            redLine.add();
            this.breakLines.push(redLine);

            var upperBreakLine = this.chart.renderer.path([
                'M', this.chart.plotLeft - 5, getYPosition,
                'L', this.chart.plotLeft + 5, getYPosition + 10
            ]).attr({
                stroke: '#ccd6eb',
                'stroke-width': 2,
                zIndex: 999
            })
            upperBreakLine.add();
            this.breakLines.push(upperBreakLine);

            var betweenBreakLine = this.chart.renderer.path([
                'M', this.chart.plotLeft - 5, getYPosition - 5,
                'L', this.chart.plotLeft + 5, getYPosition + 5
            ]).attr({
                stroke: '#FFFFFF',
                'stroke-width': 5.5,
                zIndex: 999
            })
            betweenBreakLine.add();
            this.breakLines.push(betweenBreakLine);

            var lowerBreakLine = this.chart.renderer.path([
                'M', this.chart.plotLeft - 5, getYPosition - 10,
                'L', this.chart.plotLeft + 5, getYPosition
            ]).attr({
                stroke: '#ccd6eb',
                'stroke-width': 2,
                zIndex: 999
            })
            lowerBreakLine.add();
            this.breakLines.push(lowerBreakLine);

            
        }
    }
    
}
