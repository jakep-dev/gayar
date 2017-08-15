import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkModel, BarChartData, BenchmarkDistributionInput } from 'app/model/model';
import { BenchmarkService } from '../../services/services';

@Component({
  selector: 'app-retention',
  templateUrl: './retention.component.html',
  styleUrls: ['./retention.component.scss']
})
export class RetentionComponent implements OnInit {

    searchParms: BenchmarkDistributionInput;

    modelData: BenchmarkModel;

    setModelData(modelData: BenchmarkModel) {
        this.modelData = modelData;
    }

    private chartData: BehaviorSubject<BarChartData>;
    chartData$: Observable<BarChartData>;

    @Input() set componentData(data: BenchmarkDistributionInput) {
        if(data) {
            this.searchParms = data;
            if(data.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
                this.benchmarkService.getBenchmarkPremiumByCompanyId(data.retentionValue, 'RETENTION', data.companyId)
                .subscribe(modelData => this.setModelData(modelData));
            } else {
                this.benchmarkService.getBenchmarkPremiumByManualInput(data.retentionValue, 'RETENTION', data.naics, data.revenueRange)
                .subscribe(modelData => this.setModelData(modelData));
            }
        }
    }

    onDataComplete(newChartData : BarChartData) {
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

    constructor(private benchmarkService: BenchmarkService) {
        this.chartData = new BehaviorSubject<BarChartData>(
            {
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
