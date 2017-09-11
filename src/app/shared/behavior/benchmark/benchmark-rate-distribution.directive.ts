import { Directive, Output, Input, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BenchmarkRateModel, RateQuartile, BoxPlotChartData } from 'app/model/model';
import { BaseChart } from './../../charts/base-chart';
import { SearchService } from './../../../services/services';

@Directive({
    selector: '[benchmark-rate-distribution-behavior]'
})
export class BenchmarkRateDistributionDirective implements OnInit, OnChanges {

    @Input() modelData: BenchmarkRateModel;

    @Output() onDataComplete = new EventEmitter<BoxPlotChartData>();

    @Input() chartComponent: BaseChart;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['chartComponent'] && changes['chartComponent'].currentValue) {
            this.chartComponent = changes['chartComponent'].currentValue;

            let lineColor = 'gray';
            let lineWidth = 1;
            let label = '';
            let labelHeight = 10;
            let xPos = 0;
            let yPos = 0;
            let companyNameHeight = 0;
            let yCompanyPosition = 0;

            if (this.hasClientLimit) {
                companyNameHeight = (Math.ceil((this.companyName.length * 6) / 200)) * labelHeight;
                yCompanyPosition = this.chartComponent.getYAxisPosition(this.quartile.clientRPMPercentileValue) - 4;
                this.chartComponent.addChartLabel(
                    this.companyName,
                    this.chartComponent.getXAxisPosition(3.2),
                    yCompanyPosition,
                    null,
                    labelHeight,
                    'bold',
                    200
                );

                this.chartComponent.addChartLabel(
                    this.quartile.clientRPMPercentile + 'th% ' + this.quartile.clientRPMPercentileValue_KMB,
                    this.chartComponent.getXAxisPosition(0.2),
                    yCompanyPosition,
                    null,
                    labelHeight,
                    'bold'
                );
            }

            label = 'Min ' + this.quartile.minRPM_KMB;
            xPos = this.chartComponent.getXAxisPosition(2) - (label.length * 7);
            yPos = this.chartComponent.getYAxisPosition(this.quartile.minRPM) + 15;

            this.chartComponent.addChartLabel(
                label,
                xPos,
                yPos,
                null,
                labelHeight,
                'bold'
            );
            this.chartComponent.addLine([xPos + (label.length * 7), yPos - 3],
                [xPos + (label.length * 7) + 10, yPos - 3, this.chartComponent.getXAxisPosition(2.3), this.chartComponent.getYAxisPosition(this.quartile.minRPM)],
                lineColor,
                lineWidth);

            label = 'Max ' + this.quartile.maxRPM_KMB;
            xPos = this.chartComponent.getXAxisPosition(2) - (label.length * 7);
            yPos = this.chartComponent.getYAxisPosition(this.quartile.maxRPM) - 10;

            this.chartComponent.addChartLabel(
                label,
                xPos,
                yPos,
                null,
                labelHeight,
                'bold'
            );
            this.chartComponent.addLine([xPos + (label.length * 7), yPos - 3],
                [xPos + (label.length * 7) + 10, yPos - 3, this.chartComponent.getXAxisPosition(2.3), this.chartComponent.getYAxisPosition(this.quartile.maxRPM) - 1],
                lineColor,
                lineWidth);

            label = '25th% ' + this.quartile.firstQuartile_KMB;
            xPos = this.chartComponent.getXAxisPosition(3.3);
            yPos = this.chartComponent.getYAxisPosition(this.quartile.firstQuartile) + 15;

            if(this.hasClientLimit 
                && yPos + labelHeight >= yCompanyPosition
                && yPos <= yCompanyPosition + companyNameHeight) {
                yPos = yCompanyPosition + companyNameHeight + 15;
            }

            this.chartComponent.addChartLabel(
                label,
                xPos,
                yPos,
                null,
                labelHeight,
                'bold'
            );
            this.chartComponent.addLine([xPos, yPos - 3],
                [xPos - 10, yPos - 3, this.chartComponent.getXAxisPosition(3), this.chartComponent.getYAxisPosition(this.quartile.firstQuartile)],
                lineColor,
                lineWidth);

            label = '75th% ' + this.quartile.fourthQuartile_KMB;
            xPos = this.chartComponent.getXAxisPosition(3.3);
            yPos = this.chartComponent.getYAxisPosition(this.quartile.fourthQuartile) - 10;

            if(this.hasClientLimit 
                && yPos + labelHeight >= yCompanyPosition
                && yPos <= yCompanyPosition + companyNameHeight) {
                yPos = yCompanyPosition - 15;
            }

            this.chartComponent.addChartLabel(
                label,
                xPos,
                yPos,
                null,
                labelHeight,
                'bold'
            );
            this.chartComponent.addLine([xPos, yPos - 3],
                [xPos - 10, yPos - 3, this.chartComponent.getXAxisPosition(3), this.chartComponent.getYAxisPosition(this.quartile.fourthQuartile) - 1],
                lineColor,
                lineWidth);

            this.chartComponent.addChartLabel(
                'Median ' + this.quartile.median_KMB,
                this.chartComponent.getXAxisPosition(2) - (('Median ' + this.quartile.median_KMB).length * 7),
                this.chartComponent.getYAxisPosition(this.quartile.median) + 3,
                null,
                labelHeight,
                'bold'
            );

            let xPosition = (this.hasClientLimit) ? this.chartComponent.chart.chartHeight - 20 : this.chartComponent.chart.chartHeight - 40;
            this.chartComponent.addChartLabel(
                this.displayText,
                10,
                xPosition,
                '#000000',
                labelHeight,
                null,
                this.chartComponent.chart.chartWidth - 80
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

    quartile: RateQuartile;

    displayText: string = '';

    companyName: string = '';

    hasClientLimit: boolean = false;

    constructor(private searchService: SearchService) {
        this.seriesColor = [];
        this.seriesColor[BenchmarkRateDistributionDirective.CLIENT_LINE] = '#487AA1';
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || BenchmarkRateDistributionDirective.defaultLineColor;
    }

    ngOnInit() {
        this.getCompanyName();
        this.buildHighChartObject();
    }

    getCompanyName() {
        if (this.searchService.selectedCompany && this.searchService.selectedCompany.companyName) {
            this.companyName = this.searchService.selectedCompany.companyName;
        } else if (this.searchService.searchCriteria && this.searchService.searchCriteria.value) {
            this.companyName = this.searchService.searchCriteria.value;
        }

        if(this.companyName && this.companyName.length > 30) {
            this.companyName = this.companyName.substring(0, 30) + '...';
        }
    }

    /**
     * Use chart data from web service to build parts of Highchart chart options object
     */
    buildHighChartObject() {
        if (this.modelData) {
            this.quartile = this.modelData.quartile;
            this.displayText = this.modelData.displayText;

            this.hasClientLimit = this.searchService.searchCriteria.premium &&
                this.searchService.searchCriteria.premium != '0' &&
                this.searchService.searchCriteria.limit &&
                this.searchService.searchCriteria.limit != '0';

            let yPlotLines = new Array();
            let max = null;
            let min = this.modelData.quartile.minRPM - (this.modelData.quartile.maxRPM * .1);

            if (this.hasClientLimit) {
                yPlotLines.push({
                    color: this.getSeriesColor(BenchmarkRateDistributionDirective.CLIENT_LINE),
                    value: this.modelData.quartile.clientRPMPercentileValue,
                    width: '2',
                    zIndex: 100
                });
            }

            if (this.modelData.quartile.clientRPMPercentileValue > this.modelData.quartile.maxRPM) {
                max = this.modelData.quartile.clientRPMPercentileValue + (this.modelData.quartile.clientRPMPercentileValue * .1);
                min = this.modelData.quartile.minRPM - (this.modelData.quartile.clientRPMPercentileValue * .1);
            }

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
                        spacingLeft: 30,
                        marginLeft: 90
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
                        min: min,
                        max: max,
                        startOnTick: true,
                        endOnTick: true,
                        plotLines: yPlotLines,
                        labels: {
                            formatter: function () {
                                if (Math.abs(this.value) > 1000000000 - 1) {
                                    return (this.value / 1000000000).toFixed(1) + 'B';
                                } else if (Math.abs(this.value) > 1000000 - 1) {
                                    return (this.value / 1000000).toFixed(1) + 'M';
                                } else if (Math.abs(this.value) > 1000 - 1) {
                                    return (this.value / 1000).toFixed(1) + 'k';
                                } else {
                                    return this.value;
                                }
                            }
                        }
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
