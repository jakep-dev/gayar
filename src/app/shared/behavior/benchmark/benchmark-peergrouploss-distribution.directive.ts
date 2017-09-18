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
                this.chartComponent.chart.chartHeight - 70, 
                '#000000',
                10,
                null,
                this.chartComponent.chart.chartWidth - 73
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
                series: {
                    data : []
                },
                title: '',
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
                                value: '', // For Median Peer Program Limit
                                width: '2',
                                zIndex: 5
                            },
                            {
                                color: '#487AA1',
                                width: '2',
                                zIndex: 5,
                                value: '' // For Client Limit
                            }
                        ],
                        labels: {
                            formatter: function() {
                                if(this.value > 1000000000 - 1) {
                                    return (this.value / 1000000000) + 'B';
                                } else if(this.value > 1000000 - 1) {
                                    return (this.value / 1000000) + 'M';
                                } else if(this.value > 1000 - 1) {
                                    return (this.value / 1000) + 'k';
                                } else {
                                    return this.value;
                                }
                            }
                        },
                        max : this.getMaxYAxisLimit(),
                    },
                    legend: {
                        margin: 10,
                        y: -45
                    },
                    tooltip: {
                        shared: false,
                        formatter: function () {
                            let value =  (this.point.stackTotal.toString()).replace(
                                /^([-+]?)(0?)(\d+)(.?)(\d+)$/g, function(match, sign, zeros, before, decimal, after) {
                                var reverseString = function(string) { return string.split('').reverse().join(''); };
                                var insertCommas  = function(string) { 
                                    var reversed  = reverseString(string);
                                    var reversedWithCommas = reversed.match(/.{1,3}/g).join(',');
                                    return reverseString(reversedWithCommas);
                                };
                                return sign + (decimal ? insertCommas(before) + decimal + after : insertCommas(before + after));
                                }
                            );
                            return '<b>' + value + '</b><br/>Loss Amount<br/>';
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
            tempChartData.series = this.seriesData();
            this.displayText = this.modelData.displayText;

            let seriesIndex : number;
            let seriesLength: number;
            let dataLossAbove: any;
            let dataLossBelow: any;
            dataLossAbove = new Object();
            dataLossBelow = new Object();
            dataLossAbove.data = new Array();
            dataLossBelow.data = new Array();

            seriesLength = this.modelData.losses.length;

            for(seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++) {
                
                dataLossAbove.data.push(this.modelData.losses[seriesIndex].lossAboveLimit);
                dataLossBelow.data.push(this.modelData.losses[seriesIndex].lossBelowLimit);
                
                // scenario 1
                if(((this.modelData.clientLimit > 0 && (this.modelData.clientLimit <= this.modelData.maxLoss)
                    && (this.modelData.medianLimit !== 0
                    && (this.modelData.clientLimit > this.modelData.medianLimit ||
                        this.modelData.clientLimit < this.modelData.medianLimit))))){ 
                    console.log('scenario1');
                    tempChartData.series = this.seriesData(this.modelData.lossAmountAboveLabel,
                                            this.modelData.lossAmountBelowLabel,
                                            false,
                                            false,
                                            this.modelData.clientLimitLabel,
                                            this.modelData.medianLimitLabel,
                                            false,
                                            dataLossAbove.data, dataLossBelow.data);
                    tempChartData.customChartSettings.yAxis.plotLines[0].value = this.modelData.medianLimit;
                    tempChartData.customChartSettings.yAxis.plotLines[1].value = this.modelData.clientLimit;
                }
                // scenario 2 
                if(this.modelData.clientLimit === this.modelData.medianLimit){
                    console.log('scenario2');
                    tempChartData.series = this.seriesData(this.modelData.lossAmountAboveLabel,
                                            this.modelData.lossAmountBelowLabel,
                                            false,
                                            false,
                                            this.modelData.clientLimitLabel,
                                            this.modelData.medianLimitLabel,
                                            false,
                                            dataLossAbove.data, dataLossBelow.data);
                    tempChartData.customChartSettings.yAxis.plotLines[0].width = 3.7;
                    tempChartData.customChartSettings.yAxis.plotLines[0].value = this.modelData.medianLimit;
                    tempChartData.customChartSettings.yAxis.plotLines[1].value = this.modelData.clientLimit;
                } 
                // scenario 3
                if(this.modelData.medianLimit <= this.modelData.maxLoss
                    &&  this.modelData.clientLimit === null){
                    console.log('scenario3');
                    tempChartData.series = this.seriesData(false,
                                            false,
                                            this.modelData.lossAboveMedianLimitLabel,
                                            this.modelData.lossBelowMedianLimitLabel,
                                            false,
                                            this.modelData.medianLimitLabel,
                                            false,
                                            dataLossAbove.data, dataLossBelow.data);
                    tempChartData.customChartSettings.yAxis.plotLines[1].width = 0;
                    tempChartData.customChartSettings.yAxis.plotLines[0].value = this.modelData.medianLimit;
                }
                // scenario 4
                if(this.modelData.clientLimit !== null && this.modelData.medianLimit !== 0 
                    && this.modelData.medianLimit <= this.modelData.maxLoss
                    && this.modelData.clientLimit > this.modelData.maxLoss){
                            console.log('scenario4');
                            tempChartData.series = this.seriesData(false,
                                            false,
                                            this.modelData.lossAboveMedianLimitLabel,
                                            this.modelData.lossBelowMedianLimitLabel,
                                            this.modelData.clientLimitLabel,
                                            this.modelData.medianLimitLabel,
                                            false,
                                            dataLossAbove.data, dataLossBelow.data);
                        tempChartData.customChartSettings.yAxis.plotLines[0].value = this.modelData.medianLimit;
                        tempChartData.customChartSettings.yAxis.plotLines[1].value = this.modelData.clientLimit;
                }
                // scenario 5
                if(this.modelData.clientLimit && this.modelData.clientLimit < this.modelData.maxLoss
                    && (this.modelData.clientLimit === 0 || this.modelData.clientLimit === null)){
                            console.log('scenario5');
                            tempChartData.series = this.seriesData(false,
                                            false,
                                            this.modelData.lossAmountAboveLabel,
                                            this.modelData.lossAmountBelowLabel,
                                            this.modelData.clientLimitLabel,
                                            false,
                                            false, 
                                            dataLossAbove.data, dataLossBelow.data);
                        tempChartData.customChartSettings.yAxis.plotLines[1].value = this.modelData.clientLimit;
                }
                // scenario 6
                if(this.modelData.clientLimit > this.modelData.maxLoss
                    && (this.modelData.clientLimit === 0 || this.modelData.clientLimit === null)){
                            console.log('scenario6');
                            tempChartData.series = this.seriesData(false,
                                            false,
                                            false,
                                            false,
                                            this.modelData.clientLimitLabel,
                                            false,
                                            this.modelData.lossAmountLabel, 
                                            dataLossAbove.data, dataLossBelow.data);
                        tempChartData.customChartSettings.yAxis.plotLines[1].value = this.modelData.clientLimit;
                }
                // scenario 7
                if(this.modelData.clientLimit && this.modelData.maxLoss && (this.modelData.medianLimit !== this.modelData.clientLimit
                     && this.modelData.clientLimit > this.modelData.maxLoss
                        && this.modelData.medianLimit > this.modelData.maxLoss)){ 
                            console.log('scenario7');
                            tempChartData.series = this.seriesData(false,
                                            false,
                                            false,
                                            false,
                                            this.modelData.clientLimitLabel,
                                            this.modelData.medianLimitLabel,
                                            this.modelData.lossAmountLabel,
                                            dataLossAbove.data, dataLossBelow.data);    
                    tempChartData.customChartSettings.yAxis.plotLines[0].value = this.modelData.medianLimit;
                    tempChartData.customChartSettings.yAxis.plotLines[1].value = this.modelData.clientLimit;
                }
                // scenario 8
                if(this.modelData.clientLimit && this.modelData.clientLimit > this.modelData.maxLoss
                        && this.modelData.medianLimit > this.modelData.maxLoss
                        && this.modelData.medianLimit === this.modelData.clientLimit){
                        console.log('scenario8');
                        tempChartData.series = this.seriesData(false,
                                            false,
                                            false,
                                            false,
                                            this.modelData.clientLimitLabel,
                                            this.modelData.medianLimitLabel,
                                            this.modelData.lossAmountLabel, 
                                            dataLossAbove.data, dataLossBelow.data);
                    tempChartData.customChartSettings.yAxis.plotLines[0].value = this.modelData.medianLimit;
                    tempChartData.customChartSettings.yAxis.plotLines[1].value = this.modelData.clientLimit;  
                }
                // scenario 9
                if(this.modelData.maxLoss !== null && this.modelData.clientLimit === null 
                        && this.modelData.medianLimit > this.modelData.maxLoss){
                    console.log('scenario9');
                    tempChartData.series = this.seriesData(false,
                                            false,
                                            false,
                                            false,
                                            false,
                                            this.modelData.medianLimitLabel,
                                            this.modelData.lossAmountLabel, 
                                            dataLossAbove.data, dataLossBelow.data);
                    tempChartData.customChartSettings.yAxis.plotLines[0].value = this.modelData.medianLimit;
                    tempChartData.customChartSettings.yAxis.plotLines[1].width = 0;
                }
                // scenario 10
                if(this.modelData.clientLimit === null 
                        && (this.modelData.medianLimit === 0 || this.modelData.medianLimit === null)
                         && this.modelData.maxLoss !== null && this.modelData.minLoss !== null){
                    console.log('scenario10');
                    tempChartData.series = this.seriesData(false,
                                            false,
                                            false,
                                            false,
                                            false,
                                            false,
                                            this.modelData.lossAmountLabel, 
                                            dataLossAbove.data, dataLossBelow.data);
                    tempChartData.customChartSettings.yAxis.plotLines[0].width = 0;
                    tempChartData.customChartSettings.yAxis.plotLines[1].width = 0;
                }
                // scenario 11
                if((this.modelData.clientLimit !== null && this.modelData.medianLimit !== null) 
                    && (this.modelData.maxLoss === null && this.modelData.maxLoss === null)){
                        console.log('scenario11');
                        tempChartData.series = this.seriesData(false,
                                            false,
                                            false,
                                            false,
                                            false,
                                            false,
                                            false, 
                                            dataLossAbove.data, dataLossBelow.data);
                    tempChartData.customChartSettings.yAxis.plotLines[0].width = 0;
                    tempChartData.customChartSettings.yAxis.plotLines[1].width = 0;
                }
                // scenario 12
                if((this.modelData.clientLimit !== null && this.modelData.medianLimit!== null) 
                    && (this.modelData.clientLimit === this.modelData.medianLimit)
                    && (this.modelData.losses === null)){
                        console.log('scenario12');
                        tempChartData.series = this.seriesData(false,
                                            false,
                                            false,
                                            false,
                                            false,
                                            false,
                                            false, 
                                            dataLossAbove.data, dataLossBelow.data);
                    tempChartData.customChartSettings.yAxis.plotLines[0].width = 0;
                    tempChartData.customChartSettings.yAxis.plotLines[1].width = 0;
                }
                // scenario 13
                if((this.modelData.clientLimit === null || this.modelData.medianLimit === 0)
                     && this.modelData.maxLoss === null && this.modelData.minLoss === null){
                        console.log('scenario13');
                        tempChartData.series = this.seriesData(false,
                                            false,
                                            false,
                                            false,
                                            false,
                                            false,
                                            false, 
                                            dataLossAbove.data, dataLossBelow.data);
                    tempChartData.customChartSettings.yAxis.plotLines[0].width = 0;
                    tempChartData.customChartSettings.yAxis.plotLines[1].width = 0;
                }

            }
            this.onDataComplete.emit(tempChartData);
        }
    }

    getMaxYAxisLimit(){
        var max = Math.max(this.modelData.clientLimit,
                        this.modelData.medianLimit,
                        this.modelData.maxLoss,
                        );
        return max + (max * .1);
    }

    seriesData(series1?,series2?,series3?,series4?,series5?,series6?,series7?, lossAboveData?, lossBelowData?){
        let data = [
            {
                name: this.modelData.lossAmountAboveLabel, //Loss Amount - Above Client Limit
                showInLegend: false,  
                color: '#F68C20',
                stack: 'male',
                data: lossAboveData
            }, 
            {
                name: this.modelData.lossAmountBelowLabel, //Loss Amount - Below Client Limit
                showInLegend: false,
                color: '#B1D23B',
                stack: 'male',
                data: lossBelowData
            },
            {
                name: series1, //Loss Amount - Above Client Limit
                type: 'line', 
                showInLegend: (series1 === false) ? false: true,
                color: '#F68C20',
                marker: {
                    symbol: 'circle',
                    enabled: true,
                    radius : 12
                },
            },
            {
                name: series2, //Loss Amount - Below Client Limit
                type: 'line', 
                showInLegend: (series2 === false) ? false: true,
                color: '#B1D23B',
                marker: {
                    symbol: 'circle',
                    enabled: true,
                    radius : 12
                },
            },
            {
                name: series3, //Loss Amount - Above Median Limit
                type: 'line', 
                showInLegend: (series3 === false) ? false: true,
                color: '#F68C20',
                marker: {
                    symbol: 'circle',
                    enabled: true,
                    radius : 12
                },
            },
            {
                name: series4, //Loss Amount - Below Median Limit
                type: 'line', 
                showInLegend: (series4 === false) ? false: true,
                color: '#B1D23B',
                marker: {
                    symbol: 'circle',
                    enabled: true,
                    radius : 12
                },
            },
            {
                name: series5, //Client Limit
                type: 'line',
                showInLegend: (series5 === false) ? false: true,
                color: '#487AA1',
                marker: {
                    symbol: 'circle',
                    enabled: true,
                    radius : 12
                },
                marginBottom: 50,
            }, 
            {
                name: series6, //Median Peer Program Limit
                type: 'line',
                showInLegend:  (series6 === false) ? false: true,
                color: '#000000',
                marker: {
                    symbol: 'circle',
                    enabled: true,
                    radius : 12
                },
                marginBottom: 50,  
            },
            {
                name: series7, //Loss Amount
                type: 'line',
                showInLegend: (series7 === false) ? false: true,
                color: '#B1D23B',
                marker: {
                    symbol: 'circle',
                    enabled: true,
                    radius : 12
                },
                marginBottom: 50,       
            }
        ]

        return data;
    }
}
