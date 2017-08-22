import { Directive, Output, Input, EventEmitter } from '@angular/core';
import { BenchmarkLimitModel, BoxPlotChartData } from 'app/model/model';
import { BaseChartComponent } from './../../charts/base-chart/base-chart.component';

@Directive({
    selector: '[benchmark-peergrouploss-distribution-behavior]'
})
export class BenchmarkPeerGroupLossDistributionDirective {

    @Input('modelData') set setChartData(data: BenchmarkLimitModel) {

        if(data) {
            let tempChartData: BoxPlotChartData = {
                series: [
                    {
                        name: 'Loss Amount - Above Client Limit',
                        showInLegend: false,
                        color: '#F68C20',
                        stack: 'male',
                        data: []
                    }, 
                    {
                        name: 'Loss Amount - Below Client Limit',
                        showInLegend: false,
                        color: '#B1D23B',
                        stack: 'male',
                        data: []
                    },
                    {
                        name: 'Loss Amount - Above Client Limit',
                        type: 'line', 
                        color: '#F68C20',
                        marker: {
                            symbol: 'circle',
                            enabled: true,
                            radius : 12
		        		},
                        
                    },
                    {
                        name: 'Loss Amount - Below Client Limit',
                        type: 'line', 
                        color: '#B1D23B',
                        marker: {
                            symbol: 'circle',
                            enabled: true,
                            radius : 12
		        		},
                        
                    },
                    {
                        name: 'Client Limit',
                        type: 'line',
                        color: '#487AA1',
                        marker: {
                            symbol: 'circle',
                            enabled: true,
                            radius : 12
		        		},
				        marginBottom: 30
                    }, 
                    {
                        name: 'Median Peer Program Limit',
                        type: 'line',
                        color: '#000000',
                        marker: {
                            symbol: 'circle',
                            enabled: true,
                            radius : 12
		        		},
				        marginBottom: 30
                    }
                ],
                title: data.chartTitle,
                subtitle: data.filterDescription,
                displayText: data.displayText,
                categories: ['1', '2'],
                xAxisLabel: data.xAxis,
                yAxisLabel: data.yAxis,
                xAxisFormatter: null,
                customChartSettings: {
                    chart: {
                        spacingRight: 20,
                        spacingLeft: 20,
                        spacingBottom: 40,
                        marginBottom: 100,
                    },
                    credits: {
                        enabled: true
                    },
                    subtitle: {
                        labels: {
                            enabled: false
                        }
                    },
                    xAxis: {
                        labels: {
                            rotation: 0,
                            enabled: false
                        },
                        title: {
                            //align: 'center',
                            //verticalAlign: 'bottom',
                            //margin: 15,
                            //floating: true,
                            style: {
                                padding: '5px'
                            }
                        }
                    },
                    yAxis: {
                        allowDecimals: false,
                        plotLines: [
                            {
                                color: '#000000',
                                value: data.medianLimit, // For Median Peer Program Limit
                                width: '2',
                                zIndex: 5
                            },
                            {
                                color: '#487AA1',
                                width: '2',
                                zIndex: 5,
                                value: data.clientLimit // For Client Limit
                            }
                        ]
                    },
                    legend: {
                        margin: 10
                    },
                    tooltip: {
                        shared: false,
                        formatter: function () {
                            return '<b>' + this.x + '</b><br/>' + this.series.name + '<br/>';
                        }
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        },
                        series: {
                            pointPadding: 0.0125,
                            shadow: false
                        },
                        groupPadding: 0,
                        line: {
                            dataGrouping: {
                                enabled: false
                            }
                        }
                    }
                },
                hasRedrawActions: true
            }
            this.displayText = data.displayText;
            for (let i = 0; i < data.losses.length; i++) {
                tempChartData.series[0].data.push(data.losses[i].lossAboveLimit);
                tempChartData.series[1].data.push(data.losses[i].lossBelowLimit);
            }
            this.onDataComplete.emit(tempChartData);
        }
    }

    @Output() onDataComplete = new EventEmitter<BoxPlotChartData>();

    @Input('chartObject') set setChartObject(chartObject: any) {
        if(chartObject && chartObject.isObjectValid) {
            let chart = chartObject.highChartObject;
            BaseChartComponent.addChartLabel(
                chart, 
                this.displayText, 
                10, 
                chart.chartHeight - 30, 
                '#000000',
                10,
                null,
                500
            );
            BaseChartComponent.addChartImage(
                chart, 
                'https://www.advisen.com/img/advisen-logo.png', 
                chart.chartWidth - 80, 
                chart.chartHeight - 20, 
                69, 
                17
            );
            chartObject.isObjectValid = false;
        }
    }

    public static defaultLineColor: string = 'black';

    static CLIENT_LINE: string = "Client Line";

    seriesColor: string[];

    displayText: string = '';

    constructor() {
        this.seriesColor = [];
        this.seriesColor["Above Client"] = '#F68C20';
        this.seriesColor["Below Client"] = '#B1D23B';
        this.seriesColor[BenchmarkPeerGroupLossDistributionDirective.CLIENT_LINE] = '#487AA1';
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || BenchmarkPeerGroupLossDistributionDirective.defaultLineColor;
    }

    ngOnInit() {}
    
}