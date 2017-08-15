import { Directive, Output, Input, EventEmitter } from '@angular/core';
import { BenchmarkModel, ChartData } from 'app/model/model';
import { BaseChartComponent } from '../charts/base-chart/base-chart.component';

@Directive({
    selector: '[benchmark-retention-distribution-behavior]'
})
export class BenchmarkRetentionDistributionDirective {

    @Input('modelData') set setChartData(data: BenchmarkModel) {

        if(data) {
            let tempChartData: ChartData = {
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

            let i: number;
            let n1: number;
            let groups = new Array();
            let groupNames = new Array();
            n1 = data.buckets.length;
            let bucket: any;
            
            for(i = 0; i < n1; i++) {
                bucket = data.buckets[i];
                tempChartData.categories.push(bucket.label);
                if(!groups[bucket.group]) {
                    groups[bucket.group] = new Array();
                    groupNames.push(bucket.group);
                }
                groups[bucket.group][bucket.label] = bucket.count;
            }

            let groupName: string;
            let group: any;
            let j: number;
            let n2: number;
            let series: any;

            //must be declared as var so the value still exists after function exits
            var clientCategoryLabel : any;
            clientCategoryLabel = new Object({value : ''});

            n2 = tempChartData.categories.length;
            n1 = groupNames.length;
            for(i = 0; i < n1; i++) {
                group = groups[groupNames[i]];
                series = new Object();
                series.name = groupNames[i];
                series.color = this.getSeriesColor(series.name);
                series.pointWidth = 20;
                series.borderWidth = 0;
                series.pointPlacement = -0.20;
                series.data = new Array();
                for(j = 0; j < n2; j++) {
                    if((group[tempChartData.categories[j]] != undefined) && (group[tempChartData.categories[j]] != null)) {
                        if(series.name === BenchmarkRetentionDistributionDirective.CLIENT_LINE) {
                            clientCategoryLabel.value = tempChartData.categories[j];
                        }
                        series.data.push(group[tempChartData.categories[j]]);
                    } else {
                        series.data.push(null);
                    }
                }
                tempChartData.series.push(series);
            }
            if(clientCategoryLabel && clientCategoryLabel.value) {
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

    @Output() onDataComplete = new EventEmitter<ChartData>();

    @Input('chartObject') set setChartObject(chartObject: any) {
        if(chartObject && chartObject.isObjectValid) {
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
        this.seriesColor[BenchmarkRetentionDistributionDirective.CLIENT_LINE] = '#487AA1';
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || BenchmarkRetentionDistributionDirective.defaultLineColor;
    }

    ngOnInit() {}
    
}