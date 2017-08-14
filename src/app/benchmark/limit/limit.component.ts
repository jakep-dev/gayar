import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkModel, ChartData, BenchmarkPremiumDistributionInput } from 'app/model/model';
import { BenchmarkService } from '../../services/services';

@Component({
    selector: 'app-limit',
    templateUrl: './limit.component.html',
    styleUrls: ['./limit.component.scss']
})
export class LimitComponent implements OnInit {
  
    searchParms: BenchmarkPremiumDistributionInput;

    modelData: BenchmarkModel;

    setModelData(modelData: BenchmarkModel) {
        this.modelData = modelData;
    }

    private chartData: BehaviorSubject<ChartData>;
    chartData$: Observable<ChartData>;

    @Input() set componentData(data: BenchmarkPremiumDistributionInput) {
      this.searchParms = data;
      if(data.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
        this.benchmarkService.getBenchmarkPremiumByCompanyId(data.clientValue, data.chartType, data.companyId)
          .subscribe(modelData => this.setModelData(modelData));
      } else {
        this.benchmarkService.getBenchmarkPremiumByManualInput(data.clientValue, data.chartType, data.naics, data.revenueRange)
          .subscribe(modelData => this.setModelData(modelData));
      }
    }

    onDataComplete(newChartData : ChartData) {
        this.chartData.next(newChartData);
    }

    constructor(private benchmarkService: BenchmarkService) {
        this.chartData = new BehaviorSubject<ChartData>(
            {
                categories: [],
                series: [],
                subtitle: '',
                title: '',
                xAxisFormatter: null,
                xAxisLabel: '',
                yAxisLabel: ''
            }
        );
        this.chartData$ = this.chartData.asObservable();
    }

    ngOnInit() {}

}
