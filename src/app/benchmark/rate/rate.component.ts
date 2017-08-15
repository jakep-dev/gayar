import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkRateModel, ChartData  } from 'app/model/model';
import { BenchmarkService } from '../../services/services';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {

    searchParms: number;

    modelData: BenchmarkRateModel;

    setModelData(modelData: BenchmarkRateModel) {
        this.modelData = modelData;
    }

    private chartData: BehaviorSubject<ChartData>;
    chartData$: Observable<ChartData>;

    @Input() set companyId(companyId: number) {
        this.searchParms = companyId;
        if(companyId) {
            this.benchmarkService.getRatePerMillion(companyId)
            .subscribe(modelData => this.setModelData(modelData));
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
