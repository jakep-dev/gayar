import { Directive, Output, Input, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BenchmarkRateModel, RateQuartile, BoxPlotChartData } from 'app/model/model';
import { BaseChart } from './../../charts/base-chart';
import { SearchService } from 'app/services/services';

@Directive({
    selector: '[benchmark-rate-distribution-behavior]'
})
export class BenchmarkRateDistributionDirective implements OnInit, OnChanges {

    @Input() modelData: BenchmarkRateModel;

    @Output() onDataComplete = new EventEmitter<BoxPlotChartData>();

    @Input() chartComponent: BaseChart;

    ngOnChanges(changes: SimpleChanges) {}

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
        if (this.searchService.searchCriteria &&
            this.searchService.searchCriteria.type &&
            this.searchService.searchCriteria.type !== 'SEARCH_BY_MANUAL_INPUT' &&
            this.searchService.selectedCompany && 
            this.searchService.selectedCompany.companyName) {
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

                if (this.modelData.quartile.clientRPMPercentileValue > this.modelData.quartile.maxRPM) {
                    max = this.modelData.quartile.clientRPMPercentileValue + (this.modelData.quartile.clientRPMPercentileValue * .1);
                    min = this.modelData.quartile.minRPM - (this.modelData.quartile.clientRPMPercentileValue * .1);
                } else if (this.modelData.quartile.clientRPMPercentileValue < this.modelData.quartile.minRPM) {
                    min = this.modelData.quartile.clientRPMPercentileValue - (this.modelData.quartile.maxRPM * .1);
                }
            }

            let tempChartData: BoxPlotChartData = {
                series: [],
                title: '',
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

    ordinalSuffix(i) {
        var j = i % 10,
            k = i % 100;
        if(i == 0) {
            return i;
        }
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

}
