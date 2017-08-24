import { Directive, Output, Input, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BenchmarkRateModel, RateQuartile, BoxPlotChartData } from 'app/model/model';
import { BaseChart } from './../../charts/base-chart';
import { SearchService } from './../../../services/services';

@Directive({
    selector: '[benchmark-rate-distribution-behavior]'
})
export class BenchmarkRateDistributionDirective implements OnInit, OnChanges {

    @Input() modelData : BenchmarkRateModel;

    @Output() onDataComplete = new EventEmitter<BoxPlotChartData>();

    @Input() chartComponent: BaseChart;
    
    ngOnChanges(changes: SimpleChanges) {
        if(changes['chartComponent'] && changes['chartComponent'].currentValue) {
            this.chartComponent = changes['chartComponent'].currentValue;
            this.chartComponent.addChartLabel(
                'Min ' + this.quartile.minRPM_KMB,
                this.chartComponent.getXAxisPosition(2.5) - 34, 
                this.chartComponent.getYAxisPosition(this.quartile.minRPM) + 10,
                null,
                10,
                'bold'
            );
            this.chartComponent.addChartLabel(
                '25th% ' + this.quartile.firstQuartile_KMB,
                this.chartComponent.getXAxisPosition(2.5) - 34, 
                this.chartComponent.getYAxisPosition(this.quartile.firstQuartile) + 10,
                null,
                10,
                'bold'
            );
            this.chartComponent.addChartLabel(
                'Median ' + this.quartile.median_KMB,
                this.chartComponent.getXAxisPosition(2) - (('Median ' + this.quartile.median_KMB).length * 7),
                this.chartComponent.getYAxisPosition(this.quartile.median) + 3,
                null,
                10,
                'bold'
            );

            this.chartComponent.addChartLabel(
                '75th% ' + this.quartile.fourthQuartile_KMB,
                this.chartComponent.getXAxisPosition(2.5) - 34,
                this.chartComponent.getYAxisPosition(this.quartile.fourthQuartile) - 5,
                null,
                10,
                'bold'
            );
            this.chartComponent.addChartLabel(
                'Max ' + this.quartile.maxRPM_KMB,
                this.chartComponent.getXAxisPosition(2.5) - 34,
                this.chartComponent.getYAxisPosition(this.quartile.maxRPM) - 5,
                null,
                10,
                'bold'
            );

            this.chartComponent.addChartLabel(
                this.quartile.clientRPMPercentile + 'th% ' + this.quartile.clientRPMPercentileValue_KMB,
                this.chartComponent.getXAxisPosition(0.5),
                this.chartComponent.getYAxisPosition(this.quartile.clientRPMPercentileValue) - 5,
                null,
                10,
                'bold'
            );
            this.chartComponent.addChartLabel(
                this.displayText, 
                10, 
                this.chartComponent.chart.chartHeight - 40, 
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

            if (this.searchService.selectedCompany && this.searchService.selectedCompany.companyName) {
                this.chartComponent.addChartLabel(
                    this.searchService.selectedCompany.companyName,
                    this.chartComponent.getXAxisPosition(3.5),
                    this.chartComponent.getYAxisPosition(this.quartile.clientRPMPercentileValue) - 5,
                    null,
                    10,
                    'bold'
                );
            }
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

    ngOnInit() {
        this.buildHighChartObject();
    }

    /**
     * Use chart data from web service to build parts of Highchart chart options object
     */
    buildHighChartObject() {
        if(this.modelData) {
            this.quartile = this.modelData.quartile;
            this.displayText = this.modelData.displayText;
            let tempChartData: BoxPlotChartData = {
                series: [],
                title: this.modelData.chartTitle,
                subtitle: this.modelData.filterDescription,
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
                                value: this.modelData.quartile.clientRPMPercentileValue,
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
                        [this.modelData.quartile.minRPM, this.modelData.quartile.firstQuartile, this.modelData.quartile.median, this.modelData.quartile.fourthQuartile, this.modelData.quartile.maxRPM],
                        [null, null, null, null, null],
                        [null, null, null, null, null],
                    ]
                }
            );
            this.onDataComplete.emit(tempChartData);
        }
   }

}
