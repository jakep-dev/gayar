import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkScoreModel, GaugeChartData, BenchmarkScore } from 'app/model/model';
import { DashboardService } from '../../services/services';

@Component({
  selector: 'dashboard-benchmark-score',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.scss']
})
export class BenchmarkComponent implements OnInit {

 searchParms: BenchmarkScore;

    modelData: BenchmarkScoreModel;

    setModelData(modelData: BenchmarkScoreModel) {
        this.modelData = modelData;
    }

    private chartData: BehaviorSubject<GaugeChartData>;
    chartData$: Observable<GaugeChartData>;

    @Input() set componentData(data: BenchmarkScore) {
        if(data) {
            this.searchParms = data;
            if (data.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
            this.dashboardService.getBenchmarkScore(data.companyId, data.chartType, data.limit, data.retention)
                .subscribe(chartData => this.setModelData(chartData));
            } else {
            this.dashboardService.getBenchmarkScoreByManualInput(data.chartType, data.naics, data.revenue_range, data.limit, data.retention)
                .subscribe(chartData => this.setModelData(chartData));
            }
        }
    }

    onDataComplete(newChartData : GaugeChartData) {
        this.chartData.next(newChartData);
    }

    private chartObject: BehaviorSubject<any>;
    
    chartObject$: Observable<any>;
    
    onChartReDraw(chartObject: any) {
        this.chartObject.next(
            {
                isObjectValid: true,
                highChartObject: chartObject
            }
        );
    }

    constructor(private dashboardService: DashboardService) {
        this.chartData = new BehaviorSubject<GaugeChartData>(
            {
                score: null,
                categories: [],
                series: [],
                subtitle: '',
                title: '',
                displayText: '',
                xAxisFormatter: null,
                xAxisLabel: '',
                yAxisLabel: '',
                customChartSettings: null,
                hasRedrawActions: false
            }
        );
        this.chartData$ = this.chartData.asObservable();
        this.chartObject = new BehaviorSubject<any>(
            {
                isObjectValid: false,
                highChartObject: null
            }
        );
        this.chartObject$ = this.chartObject.asObservable();
    }

    ngOnInit() {}



}
