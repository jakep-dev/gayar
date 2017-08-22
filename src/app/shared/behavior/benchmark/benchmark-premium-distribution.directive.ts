import { Directive, Output, Input, EventEmitter } from '@angular/core';
import { BenchmarkModel, BarChartData } from 'app/model/model';
import { BaseChartComponent } from './../../charts/base-chart/base-chart.component';

@Directive({
    selector: '[benchmark-premium-distribution-behavior]'
})
export class BenchmarkPremiumDistributionDirective {

    @Input('modelData') set setChartData(data: BenchmarkModel) {

        if (data) {
            let tempChartData: BarChartData = {
                series: [],
                title: data.chartTitle,
                subtitle: data.filterDescription,
                displayText: data.displayText,
                categories: [],
                xAxisLabel: data.xAxis,
                yAxisLabel: data.yAxis,
                xAxisFormatter: null,
                customChartSettings: {
                    tooltip: {
                        headerFormat: '<b>{point.key}</b><br>',
                        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
                    }
                },
                hasRedrawActions: true
            }
            this.displayText = data.displayText;

            let seriesIndex: number;
            let seriesLength: number;
            let groups = new Array();
            let groupNames = new Array();
            seriesLength = data.buckets.length;
            let bucket: any;

            for (seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++) {
                bucket = data.buckets[seriesIndex];
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
                        if (series.name === BenchmarkPremiumDistributionDirective.CLIENT_LINE) {
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

    @Output() onDataComplete = new EventEmitter<BarChartData>();

    @Input('chartObject') set setChartObject(chartObject: any) {
        if (chartObject && chartObject.isObjectValid) {
            let chart = chartObject.highChartObject;
            BaseChartComponent.addChartLabel(
                chart,
                this.displayText,
                10,
                chart.chartHeight - 10,
                '#000000',
                10,
                null
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
        this.seriesColor[BenchmarkPremiumDistributionDirective.CLIENT_LINE] = '#487AA1';
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || BenchmarkPremiumDistributionDirective.defaultLineColor;
    }

    ngOnInit() { }

}