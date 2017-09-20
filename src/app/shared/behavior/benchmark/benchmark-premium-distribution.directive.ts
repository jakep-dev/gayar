import { Directive, Output, Input, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BenchmarkModel, BarChartData } from 'app/model/model';
import { BaseChart } from './../../charts/base-chart';
import { SearchService } from './../../../services/services';

@Directive({
    selector: '[benchmark-premium-distribution-behavior]'
})
export class BenchmarkPremiumDistributionDirective implements OnInit, OnChanges {

    @Input() modelData: BenchmarkModel

    @Output() onDataComplete = new EventEmitter<BarChartData>();

    @Input() chartComponent: BaseChart;
    
    ngOnChanges(changes: SimpleChanges) {
        if(changes['chartComponent'] && changes['chartComponent'].currentValue) {
            this.chartComponent = changes['chartComponent'].currentValue;
            let labelHeight = ((Math.ceil(this.displayText.length / BenchmarkPremiumDistributionDirective.maxCharactersPerLine)) * 10);
            this.chartComponent.addChartLabel(
                this.displayText,
                10,
                this.chartComponent.chart.chartHeight - labelHeight,
                '#000000',
                10,
                null,
                this.chartComponent.chart.chartWidth - 85
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

    static maxCharactersPerLine: number = 105; //approximate max characters per line

    static CLIENT_LINE: string = "Client Line";
    
    companyName: string = '';

    seriesColor: string[];

    displayText: string = '';

    constructor(private searchService: SearchService) {
        this.seriesColor = [];
        this.seriesColor["Above Client"] = '#F68C20';
        this.seriesColor["Below Client"] = '#B1D23B';
        this.seriesColor["Distribution"] = '#B1D23B';
        this.seriesColor[BenchmarkPremiumDistributionDirective.CLIENT_LINE] = '#487AA1';
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || BenchmarkPremiumDistributionDirective.defaultLineColor;
    }

    ngOnInit() {
        this.getCompanyName();
        this.buildHighChartObject();
    }   
    
    getCompanyName() {
        if(this.searchService.selectedCompany && this.searchService.selectedCompany.companyName) {
            this.companyName = this.searchService.selectedCompany.companyName;
        } else if(this.searchService.searchCriteria && this.searchService.searchCriteria.value) {
            this.companyName = this.searchService.searchCriteria.value;
        }
    }

    /**
     * Use chart data from web service to build parts of Highchart chart options object
     */
    buildHighChartObject() {
        if (this.modelData) {
            let tempChartData: BarChartData = {
                series: [],
                title: '',
                subtitle: this.modelData.filterDescription,
                displayText: this.modelData.displayText,
                categories: [],
                xAxisLabel: this.modelData.xAxis,
                yAxisLabel: this.modelData.yAxis,
                xAxisFormatter: null,
                customChartSettings: {
                    chart: {
                        marginLeft: 75,
                        marginRight: 25,
                    },
                    tooltip: {
                        headerFormat: '<b>{point.key}</b><br>',
                        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}'
                    },
                    legend: {
                        itemStyle: {
                            'cursor': 'default'
                        }
                    }
                },
                hasRedrawActions: true
            }
            this.displayText = this.modelData.displayText;

            let seriesIndex: number;
            let seriesLength: number;
            let groups = new Array();
            let groupNames = new Array();
            seriesLength = this.modelData.buckets.length;
            let bucket: any;

            for (seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++) {
                bucket = this.modelData.buckets[seriesIndex];

                if (!groups[bucket.group]) {
                    groups[bucket.group] = new Array();
                    groupNames.push(bucket.group);
                }
                
                if(bucket.label) {
                    tempChartData.categories.push(bucket.label);
                    groups[bucket.group][bucket.label] = bucket.count;
                }
            }

            let groupName: string;
            let group: any;
            let categoryIndex: number;
            let categoriesLength: number;
            let series: any;

            //must be declared as var so the value still exists after function exits
            var clientCategoryLabel: any;
            clientCategoryLabel = new Object({ value: '' });

            categoriesLength = tempChartData.categories.length;
            seriesLength = groupNames.length;
            for (seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++) {
                group = groups[groupNames[seriesIndex]];
                series = new Object();
                series.name = groupNames[seriesIndex];
                series.color = this.getSeriesColor(series.name);
                series.pointWidth = 20;
                series.borderWidth = 0;
                series.pointPlacement = -0.20;
                series.data = new Array();
                for (categoryIndex = 0; categoryIndex < categoriesLength; categoryIndex++) {
                    if ((group[tempChartData.categories[categoryIndex]] != undefined) && (group[tempChartData.categories[categoryIndex]] != null)) {
                        if (series.name === BenchmarkPremiumDistributionDirective.CLIENT_LINE) {
                            clientCategoryLabel.value = tempChartData.categories[categoryIndex];
                            series.name = this.companyName;
                        }
                        series.data.push(group[tempChartData.categories[categoryIndex]]);
                    } else {
                        series.data.push(null);
                    }
                }
                tempChartData.series.push(series);
            }
            if (clientCategoryLabel && clientCategoryLabel.value) {
                tempChartData.xAxisFormatter = function () {
                    if (clientCategoryLabel.value === this.value) {
                        return '<span style="fill: #487AA1;font-size:11px;font-weight:bold;">' + this.value + '</span>';
                    } else {
                        return this.value;
                    }
                };
            }
            this.onDataComplete.emit(tempChartData);
        }
    }

}
