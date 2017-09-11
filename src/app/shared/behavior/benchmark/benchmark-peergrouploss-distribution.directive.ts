import { Directive, Output, Input, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BenchmarkLimitModel, BoxPlotChartData } from 'app/model/model';
import { BaseChart } from './../../charts/base-chart';

@Directive({
    selector: '[benchmark-peergrouploss-distribution-behavior]'
})
export class BenchmarkPeerGroupLossDistributionDirective implements OnInit, OnChanges {

    @Input() modelData: BenchmarkLimitModel;

    @Output() onDataComplete = new EventEmitter<BoxPlotChartData>();

    @Input() chartComponent: BaseChart;

    ngOnChanges(changes: SimpleChanges) {
        if(changes['chartComponent'] && changes['chartComponent'].currentValue) {
            this.chartComponent = changes['chartComponent'].currentValue;
            this.chartComponent.addChartLabel(
                this.displayText, 
                10, 
                this.chartComponent.chart.chartHeight - 50, 
                '#000000',
                10,
                null,
                this.chartComponent.chart.chartWidth - 75
            );
            this.chartComponent.addChartImage(
                'https://www.advisen.com/img/advisen-logo.png', 
                this.chartComponent.chart.chartWidth - 80, 
                this.chartComponent.chart.chartHeight - 20, 
                69, 
                17
            );
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

    ngOnInit() {
        this.buildHighChartObject();
    }

    /**
     * Use chart data from web service to build parts of Highchart chart options object
     */
    buildHighChartObject() {
        if(this.modelData) {
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
                        marginBottom: 50,
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
                        marginBottom: 50,
                                
                    }
                ],
                title: this.modelData.chartTitle,
                subtitle: this.modelData.filterDescription,
                displayText: this.modelData.displayText,
                categories: ['1', '2'],
                xAxisLabel: this.modelData.xAxis,
                yAxisLabel: this.modelData.yAxis,
                xAxisFormatter: null,
                customChartSettings: {
                    chart: {
                        marginLeft: 75,
                        marginRight: 25,
                        spacingBottom: 40,
                        marginBottom: 150,
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
                            margin: 20,
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
                                value: this.modelData.medianLimit, // For Median Peer Program Limit
                                width: '2',
                                zIndex: 5
                            },
                            {
                                color: '#487AA1',
                                width: '2',
                                zIndex: 5,
                                value: this.modelData.clientLimit // For Client Limit
                            }
                        ]
                    },
                    legend: {
                        margin: 10,
                        y: -30
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
            this.displayText = this.modelData.displayText;
            for (let i = 0; i < this.modelData.losses.length; i++) {
                tempChartData.series[0].data.push(this.modelData.losses[i].lossAboveLimit);
                tempChartData.series[1].data.push(this.modelData.losses[i].lossBelowLimit);
            }
            this.onDataComplete.emit(tempChartData);
        }
    }

}
