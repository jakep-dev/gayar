import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkModel, ChartData, BenchmarkDistributionInput } from 'app/model/model';
import { BenchmarkService } from '../../services/services';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit {
    searchParms: BenchmarkDistributionInput;

    modelData: BenchmarkModel;

    setModelData(modelData: BenchmarkModel) {
        this.modelData = modelData;
    }

    private chartData: BehaviorSubject<ChartData>;
    chartData$: Observable<ChartData>;

    @Input() set componentData(data: BenchmarkDistributionInput) {
        if(data) {
            this.searchParms = data;
            if(data.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
                this.benchmarkService.getBenchmarkPremiumByCompanyId(data.premiumValue, 'PREMIUM', data.companyId)
                .subscribe(modelData => this.setModelData(modelData));
            } else {
                this.benchmarkService.getBenchmarkPremiumByManualInput(data.premiumValue, 'PREMIUM', data.naics, data.revenueRange)
                .subscribe(modelData => this.setModelData(modelData));
            }
        }
    }

    onDataComplete(newChartData : ChartData) {
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
        this.chartData = new BehaviorSubject<ChartData>(
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
