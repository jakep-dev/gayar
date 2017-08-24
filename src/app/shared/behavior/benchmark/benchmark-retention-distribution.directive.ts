import { Directive, Output, Input, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BenchmarkModel, BarChartData } from 'app/model/model';
import { BaseChart } from './../../charts/base-chart';

@Directive({
    selector: '[benchmark-retention-distribution-behavior]'
})
export class BenchmarkRetentionDistributionDirective implements OnInit, OnChanges {

    @Input() modelData: BenchmarkModel;

    @Output() onDataComplete = new EventEmitter<BarChartData>();

    @Input() chartComponent: BaseChart;
    
    ngOnChanges(changes: SimpleChanges) {
        if(changes['chartComponent'] && changes['chartComponent'].currentValue) {
            this.chartComponent = changes['chartComponent'].currentValue;
            this.chartComponent.addChartLabel(
                this.displayText,
                10,
                this.chartComponent.chart.chartHeight - 10,
                '#000000',
                10,
                null
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
        this.seriesColor[BenchmarkRetentionDistributionDirective.CLIENT_LINE] = '#487AA1';
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || BenchmarkRetentionDistributionDirective.defaultLineColor;
    }

    ngOnInit() {
        this.buildHighChartObject();
    }

    /**
     * Use chart data from web service to build parts of Highchart chart options object
     */
    buildHighChartObject() {
        if (this.modelData) {
            let tempChartData: BarChartData = {
                series: [],
                title: this.modelData.chartTitle,
                subtitle: this.modelData.filterDescription,
                displayText: this.modelData.displayText,
                categories: [],
                xAxisLabel: this.modelData.xAxis,
                yAxisLabel: this.modelData.yAxis,
                xAxisFormatter: null,
                customChartSettings: {
                    tooltip: {
                        headerFormat: '<b>{point.key}</b><br>',
                        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
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
                tempChartData.categories.push(bucket.label);
                if (!groups[bucket.group]) {
                    groups[bucket.group] = new Array();
                    groupNames.push(bucket.group);
                }
                groups[bucket.group][bucket.label] = bucket.count;
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
                        if (series.name === BenchmarkRetentionDistributionDirective.CLIENT_LINE) {
                            clientCategoryLabel.value = tempChartData.categories[categoryIndex];
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
