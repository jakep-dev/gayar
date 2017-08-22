import { Directive, Output, Input, EventEmitter } from '@angular/core';
import { BenchmarkRateModel, RateQuartile, BoxPlotChartData } from 'app/model/model';
import { BaseChartComponent } from './../../charts/base-chart/base-chart.component';
import { SearchService } from './../../../services/services';

@Directive({
    selector: '[benchmark-rate-distribution-behavior]'
})
export class BenchmarkRateDistributionDirective {

    @Input('modelData') set setChartData(data: BenchmarkRateModel) {

        if(data) {
            this.quartile = data.quartile;
            this.displayText = data.displayText;
            let tempChartData: BoxPlotChartData = {
                series: [],
                title: data.chartTitle,
                subtitle: data.filterDescription,
                displayText: null,
                categories: ['1', '2', '3', '4', '5'],
                xAxisLabel: '',
                yAxisLabel: '',
                xAxisFormatter: null,
                customChartSettings: {
                    chart: {
                        spacingBottom: 50,
                        spacingLeft: 30
                    },
                    xAxis: {
                        title: {
                            text: 'Entire Peer Group',
                            margin: 20
                        },
                        labels: {
                            enabled: false
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Rate per Million'
                        },
                        min: 0,
                        tickInterval: 2500,
                        startOnTick: true,
                        endOnTick: true,
                        plotLines: [
                            {
                                color: this.getSeriesColor(BenchmarkRateDistributionDirective.CLIENT_LINE),
                                value: data.quartile.clientRPMPercentileValue,
                                width: '2',
                                zIndex: 100
                            }
                        ]
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                hasRedrawActions: true
            }
            tempChartData.series.push(
                {
                    pointWidth: 120,
                    whiskerLength: '80%',
                    name: '',
                    data: [
                        [null, null, null, null, null],
                        [null, null, null, null, null],
                        [data.quartile.minRPM, data.quartile.firstQuartile, data.quartile.median, data.quartile.fourthQuartile, data.quartile.maxRPM],
                        [null, null, null, null, null],
                        [null, null, null, null, null],
                    ]
                }
            );
            this.onDataComplete.emit(tempChartData);
        }
    }

    @Output() onDataComplete = new EventEmitter<BoxPlotChartData>();

    @Input('chartObject') set setChartObject(chartObject: any) {
        if(chartObject && chartObject.isObjectValid) {
            let chart = chartObject.highChartObject;
            BaseChartComponent.addChartLabel(
                chart, 
                'Min ' + this.quartile.minRPM_KMB,
                BaseChartComponent.getXAxisPosition(chart, 2.5) - 34, 
                BaseChartComponent.getYAxisPosition(chart, this.quartile.minRPM) + 10,
                null,
                10,
                'bold'
            );
            BaseChartComponent.addChartLabel(
                chart, 
                '25th% ' + this.quartile.firstQuartile_KMB,
                BaseChartComponent.getXAxisPosition(chart, 2.5) - 34, 
                BaseChartComponent.getYAxisPosition(chart, this.quartile.firstQuartile) + 10,
                null,
                10,
                'bold'
            );
            BaseChartComponent.addChartLabel(
                chart,
                'Median ' + this.quartile.median_KMB,
                BaseChartComponent.getXAxisPosition(chart, 2) - (('Median ' + this.quartile.median_KMB).length * 7),
                BaseChartComponent.getYAxisPosition(chart, this.quartile.median) + 3,
                null,
                10,
                'bold'
            );

            BaseChartComponent.addChartLabel(
                chart,
                '75th% ' + this.quartile.fourthQuartile_KMB,
                BaseChartComponent.getXAxisPosition(chart, 2.5) - 34,
                BaseChartComponent.getYAxisPosition(chart, this.quartile.fourthQuartile) - 5,
                null,
                10,
                'bold'
            );
            BaseChartComponent.addChartLabel(
                chart,
                'Max ' + this.quartile.maxRPM_KMB,
                BaseChartComponent.getXAxisPosition(chart, 2.5) - 34,
                BaseChartComponent.getYAxisPosition(chart, this.quartile.maxRPM) - 5,
                null,
                10,
                'bold'
            );


            BaseChartComponent.addChartLabel(
                chart,
                this.quartile.clientRPMPercentile + 'th% ' + this.quartile.clientRPMPercentileValue_KMB,
                BaseChartComponent.getXAxisPosition(chart, 0.5),
                BaseChartComponent.getYAxisPosition(chart, this.quartile.clientRPMPercentileValue) - 5,
                null,
                10,
                'bold'
            );
            BaseChartComponent.addChartLabel(
                chart, 
                this.displayText, 
                10, 
                chart.chartHeight - 40, 
                '#000000',
                10,
                null,
                chart.chartWidth - 75
            );
            
            BaseChartComponent.addChartImage(
                chart, 
                'https://www.advisen.com/img/advisen-logo.png', 
                chart.chartWidth - 80, 
                chart.chartHeight - 20, 
                69, 
                17
            );

            if (this.searchService.selectedCompany && this.searchService.selectedCompany.companyName) {
                BaseChartComponent.addChartLabel(
                    chart,
                    this.searchService.selectedCompany.companyName,
                    BaseChartComponent.getXAxisPosition(chart, 3.5),
                    BaseChartComponent.getYAxisPosition(chart, this.quartile.clientRPMPercentileValue) - 5,
                    null,
                    10,
                    'bold'
                );
            }
            chartObject.isObjectValid = false;
        }
    }

    public static defaultLineColor: string = 'black';

    static CLIENT_LINE: string = "Client Line";

    seriesColor: string[];

    quartile: RateQuartile;

    displayText: string = '';

    constructor(private searchService: SearchService) {
        this.seriesColor = [];
        this.seriesColor[BenchmarkRateDistributionDirective.CLIENT_LINE] = '#487AA1';
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || BenchmarkRateDistributionDirective.defaultLineColor;
    }

    ngOnInit() {}
    
}