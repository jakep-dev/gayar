import { BarChartData } from '../../../../model/charts/bar-chart.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseChart } from '../../base-chart';
import { ChartModule } from 'angular2-highcharts'; 

@Component({
    selector: 'bar-chart-with-break',
    templateUrl: './bar-chart-break.component.html',
    styleUrls: ['./bar-chart-break.component.css']
})
export class BarChartBreakComponent extends BaseChart implements OnInit {

    @Input() chartData: BarChartData;
    @Output() onChartRedraw = new EventEmitter<BaseChart>();

    /*onDrilldown: any = null;
    onDrillup: any = null;*/
    hasRedrawActions: boolean;
    chartWithBreakOptions: any;
    chartWithBreak: any;

    constructor() {
        super();
        this.setDefaultChartType('column');
        this.hasRedrawActions = false;
    }

    ngOnInit() {
        this.initializeBarChart();
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

            /*if (this.chartData.onDrillDown) {
                this.onDrilldown = this.chartData.onDrillDown;
            }

            if (this.chartData.onDrillUp) {
                this.onDrillup = this.chartData.onDrillUp;
            }*/

            if (this.chartData.customChartSettings) {
                this.chart.update(this.chartData.customChartSettings, true);
            } else {
                this.chart.update(this.chartOptions, true);
            }
        }
    }

    /**
     * Load barchart settings and data that requires the underlying HighChart chart object
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
        console.log('chart', this.chart)
        this.loadBarChartData();
        this.addBreakLines();
    }

    setChartWithBreak(chart: any) {
        this.chartWithBreak = chart;
        this.addBreakLines();
        console.log('chartWithBreak', this.chartWithBreak)
        this.loadBarChartWithBreakData();

        this.addBreakLines();
    }

    onRedraw(chart: BaseChart) {
        if (this.hasRedrawActions) {
            this.onChartRedraw.emit(this);
            this.hasRedrawActions = false;
        }
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
        let Highcharts = require('highcharts');

        Highcharts.wrap(Highcharts.Axis.prototype, 'getLinePath', function (proceed, lineWidth) {
            var axis = this,
                path = proceed.call(this, lineWidth),
                x = path[1],
                y = path[2];

                //console.log('wraaaaaaaaaaaaaaaaaaaaaaaaaaapppp');
        
                Highcharts.each(this.breakArray || [], function (brk) {
                    //console.log('looooooooooooooopppppppp');
                if (axis.horiz) {
                    x = axis.toPixels(brk.from);
                    path.splice(3, 0,
                        'L', x - 4, y, // stop
                        'M', x - -9, y + 5, 'L', x + 1, y - 5, // left slanted line
                        'M', x - 1, y + 5, 'L', x + -9, y - 5, // higher slanted line
                        'M', x + 4, y
                    );
                } else {
                    y = axis.toPixels(brk.from);
                    path.splice(3, 0,
                        'L', x, y - 10, // stop
                        'M', x + 6, y - 0, 'L', x - 6, y + -9, // lower slanted line
                        'M', x, y + 4
                    );
                }
            });
            console.log('paaaaaaaaaaaaaaaaaaaaatttttttth', path);
            return path;
        });

    }

    onAfterSetExtremesY($event) {
        console.log('event', $event )
    }

}
