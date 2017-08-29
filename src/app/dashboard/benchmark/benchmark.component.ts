import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkScoreModel, GaugeChartData, BenchmarkScore } from 'app/model/model';
import { DashboardService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';

@Component({
  selector: 'dashboard-benchmark-score',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.scss']
})
export class BenchmarkComponent implements OnInit {

    modelData: BenchmarkScoreModel;

    setModelData(modelData: BenchmarkScoreModel) {
        this.modelData = modelData;
    }

    chartData: GaugeChartData;

    @Input() componentData: BenchmarkScore;

    /**
     * Event handler to indicate the construction of the GaugeChart's required data is built 
     * @param newChartData GaugeChart's required data
     */
    onDataComplete(newChartData : GaugeChartData) {
        this.chartData = newChartData;
    }

    private chartComponent = new BehaviorSubject<BaseChart>(null);
    chartComponent$: Observable<BaseChart> = this.chartComponent.asObservable();
    
    /**
     * Event handler to indicate the chart is loaded 
     * @param chart The chart commponent
     */
    onChartReDraw(chart: BaseChart) {
        //this.chartComponent = chart;
        this.chartComponent.next(chart);
    }
    
    constructor(private dashboardService: DashboardService) {
    }

    ngOnInit() {
        this.getBenchmarkData();
    }

    /**
     * Get Benchmark Data from back end nodejs server
     */
    getBenchmarkData() {
        if (this.componentData.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
            this.dashboardService.getBenchmarkScore(this.componentData.companyId, this.componentData.chartType, this.componentData.limit, this.componentData.retention)
                .subscribe(chartData => this.setModelData(chartData));
            } else {
            this.dashboardService.getBenchmarkScoreByManualInput(this.componentData.chartType, this.componentData.naics, this.componentData.revenue_range, this.componentData.limit, this.componentData.retention)
                .subscribe(chartData => this.setModelData(chartData));
        }
    }        

}
