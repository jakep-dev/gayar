import { Directive, Output, Input, EventEmitter } from '@angular/core';
import { BenchmarkService } from '../../services/services';
import { BenchmarkModel, ChartData, BenchmarkPremiumDistributionInput } from 'app/model/model';

@Directive({
    selector: '[distribution-behavior]'
})
export class DistributionDirective {
    @Input() componentData: BenchmarkPremiumDistributionInput;
    @Output() getChartData: EventEmitter<ChartData> = new EventEmitter();

    chartData: ChartData;
    static CLIENT_LINE: string = "Client Line";

    constructor(private benchmarkService: BenchmarkService) { }

    ngOnInit() {
        if(this.componentData.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
        this.benchmarkService.getBenchmarkPremiumByCompanyId(this.componentData.clientValue, this.componentData.chartType, this.componentData.companyId)
          .subscribe(chartData => this.setChartData(chartData));
      } else {
        this.benchmarkService.getBenchmarkPremiumByManualInput(this.componentData.clientValue, this.componentData.chartType, this.componentData.naics, this.componentData.revenueRange)
          .subscribe(chartData => this.setChartData(chartData));
      }
    }

    setChartData(data: BenchmarkModel) {

        this.chartData = {
            series: new Array(),
            title:  data.chartTitle,
            subtitle:  data.filterDescription,
            clientValue: 0,
            xAxisLabel: '',
            yAxisLabel: ''
        };

        var i: number;
        var n1: number;
        var groups = new Array();
        var groupNames = new Array();
        var xAxisCategories = new Array();
        n1 = data.buckets.length;
        var bucket: any;
        
        for(i = 0; i < n1; i++) {
            bucket = data.buckets[i];
            xAxisCategories.push(bucket.label);
            if(!groups[bucket.group]) {
                groups[bucket.group] = new Array();
                groupNames.push(bucket.group);
            }
            groups[bucket.group][bucket.label] = bucket.count;
        }

        var groupName: string;
        var group: any;
        var j: number;
        var n2: number;
        var series;

        n2 = xAxisCategories.length;
        n1 = groupNames.length;
        for(i = 0; i < n1; i++) {
            group = groups[groupNames[i]];
            series = new Object();
            series.name = groupNames[i];
            series.data = new Array();
            for(j = 0; j < n2; j++) {
                if(group[xAxisCategories[j]]) {
                    if(series.name === DistributionDirective.CLIENT_LINE) {
                        //clientCategoryLabel.value = xAxisCategories[j];
                        this.chartData.clientValue = xAxisCategories[j];
                    }
                    series.data.push(group[xAxisCategories[j]]);
                } else {
                    series.data.push(null);
                }
            }
            this.chartData.series.push(series);
        }

        this.getChartData.emit(this.chartData);
    }
}