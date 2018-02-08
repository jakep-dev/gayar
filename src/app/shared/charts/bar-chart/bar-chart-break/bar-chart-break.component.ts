import { BarChartData } from 'app/model/charts/bar-chart.model';
import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import { BaseChart } from '../../base-chart';
import { ChartModule } from 'angular2-highcharts';

@Component({
    selector: 'bar-chart-with-break',
    templateUrl: './bar-chart-break.component.html',
    styleUrls: ['./bar-chart-break.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BarChartBreakComponent extends BaseChart implements OnInit {

    @Input() chartData: BarChartData;
    @Output() onChartRedraw = new EventEmitter<BaseChart>();

    hasRedrawActions: boolean;
    chartWithBreakOptions: any;
    chartWithBreak: any;
    breakLines:any = [];
    hasMillionValue: boolean = false;

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
        if(this.chartWithBreak) { 
            this.chartWithBreak.reflow(); 
        } 
    }

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
            this.chartData.customChartSettings.chart) {
            this.chartOptions.chart = this.chartData.customChartSettings.chart;
        }

        if (this.chartData.customChartSettings &&
            this.chartData.customChartSettings.yAxis) {
            this.chartOptions.yAxis = this.chartData.customChartSettings.yAxis;
        }

        if (this.chartData.customChartSettings &&
            this.chartData.customChartSettings.xAxis) {
            this.chartOptions.xAxis = this.chartData.customChartSettings.xAxis;
        }

        this.chartWithBreakOptions = JSON.parse(JSON.stringify(this.chartOptions));

        if (this.chartData.breakChartSettings &&
            this.chartData.breakChartSettings.yAxis) {
            this.chartWithBreakOptions.yAxis = this.chartData.breakChartSettings.yAxis;
            this.checkHasMillion();
        }

        if (this.chartData.breakChartSettings.drilldown) {
            this.chartWithBreakOptions.drilldown = this.chartData.breakChartSettings.drilldown;
        }
    }

    /**
     * Load barchart settings and data that requires the underlying HighChart chart object
     */
    loadBarChartData() {
        if (this.chartData) {
            if (this.chartData.series.length > 0) {
                let seriesIndex: number;
                let seriesLength: number;
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

            if (this.chartData.customChartSettings) {
                this.chart.update(this.chartData.customChartSettings, true);
            } else {
                this.chart.update(this.chartOptions, true);
            }
        }
    }

    /**
     * Load barchart with break settings and data that requires the underlying HighChart chart object
     */
    loadBarChartWithBreakData() {
        if (this.chartData) {
            if (this.chartData.series.length > 0) {
                let seriesIndex: number;
                let seriesLength: number;
                //clear out old series before adding new series data
                seriesLength = this.chartWithBreak.series.length;
                for (seriesIndex = seriesLength - 1; seriesIndex >= 0; seriesIndex--) {
                    this.chartWithBreak.series[seriesIndex].remove();
                }
                //add in new series data
                seriesLength = this.chartData.series.length;
                for (seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++) {
                    this.chartWithBreak.addSeries(
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

            if (this.chartData.breakChartSettings) {
                this.chartWithBreak.update(this.chartData.breakChartSettings, true);
            } else {
                this.chartWithBreak.update(this.chartWithBreakOptions, true);
            }

            if (this.chartData.breakChartSettings &&
                this.chartData.breakChartSettings.yAxis &&
                this.chartData.breakChartSettings.yAxis.length &&
                this.chartData.breakChartSettings.yAxis.length > 0) {
                this.chartData.breakChartSettings.yAxis.forEach(axis => {
                    this.chartWithBreak.addAxis(axis);
                });
            }
        }
    }

    setChart(chart: any) {
        this.chart = chart;
        this.loadBarChartData();
    }

    setChartWithBreak(chart: any) {
        this.chartWithBreak = chart;
        this.loadBarChartWithBreakData();
    }

    onRedraw(chart: BaseChart) {
       this.onChartRedraw.emit(this);
        this.hasRedrawActions = false;
        this.addBreakLines();
    }

    onDrilldown(event, withBreak) {
        if (withBreak) {
            this.chartData.onDrillDown(event, this.chartWithBreak, this.chart, withBreak);
        } else {
            this.chartData.onDrillDown(event, this.chart, this.chartWithBreak, withBreak);
        }
    }

    onDrillup(event, withBreak) {
        if (withBreak) {
            this.chartData.onDrillUp(event, this.chartWithBreak, this.chart, withBreak);
        } else {
            this.chartData.onDrillUp(event, this.chart, this.chartWithBreak, withBreak);
        }
    }

    addBreakLines() {

        this.breakLines.forEach(line => {
            line.destroy();
        });
        this.breakLines = [];        
        
        var upperBreakLine = this.chartWithBreak.renderer.path([
            'M', this.chartWithBreak.plotLeft - 5, this.chartWithBreak.chartHeight - 10,
            'L', this.chartWithBreak.plotLeft + 5, this.chartWithBreak.chartHeight
        ]).attr({
            stroke: '#ccd6eb',
            'stroke-width': 2,
            zIndex: 999
        })
        upperBreakLine.add();
        this.breakLines.push(upperBreakLine);

        var betweenBreakLine = this.chartWithBreak.renderer.path([
            'M', this.chartWithBreak.plotLeft - 5, this.chartWithBreak.chartHeight - 15,
            'L', this.chartWithBreak.plotLeft + 5, this.chartWithBreak.chartHeight - 5
        ]).attr({
            stroke: '#FFFFFF',
            'stroke-width': 5.5,
            zIndex: 999
        })
        betweenBreakLine.add();
        this.breakLines.push(betweenBreakLine);

        var lowerBreakLine = this.chartWithBreak.renderer.path([
            'M', this.chartWithBreak.plotLeft - 5, this.chartWithBreak.chartHeight - 20,
            'L', this.chartWithBreak.plotLeft + 5, this.chartWithBreak.chartHeight - 10
        ]).attr({
            stroke: '#ccd6eb',
            'stroke-width': 2,
            zIndex: 999
        })
        lowerBreakLine.add();
        this.breakLines.push(lowerBreakLine);
    }
    
    checkHasMillion() {
        let tickPosition;
        this.chartWithBreakOptions.yAxis.forEach(yAxis => {

            if(yAxis && yAxis.tickPositions) {
                tickPosition = yAxis.tickPositions;
                return true;
            }
        });

        if(tickPosition && tickPosition.length && tickPosition.length > 6) {
            this.hasMillionValue = true;
        }
    }

}
