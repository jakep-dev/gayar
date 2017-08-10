import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BenchmarkModel, ChartData, BenchmarkPremiumDistributionInput } from 'app/model/model';

@Component({
    selector: 'bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnChanges {

    @Input() chartData: ChartData;
    static defaultLineColor: string = 'black';
    static CLIENT_LINE: string = "Client Line";

    chart: any;
    
    chartOptions: any;
    seriesColor: string[];

    constructor() {
        this.seriesColor = [];
        this.seriesColor["Above Client"] = '#F68C20';
        this.seriesColor["Below Client"] = '#B1D23B';
        this.seriesColor[BarChartComponent.CLIENT_LINE] = '#487AA1';

        this.chartOptions = {
            chart: {
                type: 'column',
                marginLeft: 75,
                marginRight: 25,
                width: 600,
                height: 400
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Placeholder Title',
                style: {
                    fontSize: '14px'
                }
            },
            subtitle: {
                text: 'Placeholder Sub-Title'
            },
            xAxis: {
                type: 'category',
                categories: [],
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '11px',
                        fontFamily: 'Verdana, sans-serif',
                    },
                    //Set specific xaxis series text color
                    formatter: function () {
                        if ('5M-10M' === this.value) {
                            return '<span style="fill: #487AA1;font-size:11px;font-weight:bold;">' + this.value + '</span>';
                        } else {
                            return this.value;
                        }
                    }

                },
                title: {
                    text: 'Range (USD)',
                    style: {
                        fontSize: '11px'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Program Counts'
                }
            },
            legend: {
                shadow: false
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false,
                        radius: 8
                    },
                    scatter: {
                        enableMouseTracking: false
                    },
                    events: {
                        legendItemClick: function () {
                            //return false to disable hiding of series when legend item is click
                            return false;
                        }
                    }
                },
                column: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0
                }
            },
            lang: {
                noData: "No Data Available"
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#FF0000'
                }
            },
            series: [
            ],
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            }
        };
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes.chartData && changes.chartData.currentValue) {
            this.chartData = changes.chartData.currentValue;
            var i = 0;
            var n1 = this.chartData.series.length;
            for (i = 0; i < n1; i++) {
                this.chart.addSeries(
                    {
                        id: this.chartData.series[i].name,
                        name: this.chartData.series[i].name,
                        type: 'column',
                        color: this.getSeriesColor(this.chartData.series[i].name),
                        data: this.chartData.series[i].data
                    }
                );
            }

            this.chartOptions.title.text = this.chartData.title;
            this.chartOptions.subtitle.text = this.chartData.subtitle;

            this.chart.update(this.chartOptions, true);
        }
    }

    setChart(chart) {
        this.chart = chart;
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || BarChartComponent.defaultLineColor;
    }

}
